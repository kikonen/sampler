(function(window, angular, undefined){
var module = angular.module('ng-auth.strategies.oauth2', [
    'ng-auth.store',
    'ng-auth',
    'ng-auth.constants'
  ]);
/*
 * Build a query string from an object
 *
 * @param {Object} Hash
 * @returns {string} URI query string ('k1=v1&k2=v2')
 */
var objectToQueryString = function (obj) {
  var params = [];
  angular.forEach(obj, function (value, key) {
    params.push(encodeURIComponent(key) + '=' + encodeURIComponent(value));
  });
  return params.join('&');
};
// Preserve window.location.hash before AngularJS routing manipulation
var hash = window.location.hash;
/**
 * ng-auth strategy for OAuth 2.0
 *
 * @constructor
 * @param {Object} config
 * @param {string} instanceName 
 */
var oauth2Provider = function (config, instanceName) {
  // Service constructor
  this.$get = [
    '$location',
    '$q',
    '$window',
    '$injector',
    'authStore',
    'util',
    'REQUIRED',
    function ($location, $q, $window, $injector, authStore, util, REQUIRED) {
      var extend = angular.extend;
      forEach = angular.forEach;
      // Configuration defaults
      var defaults = {
          storeKey: function (instanceName) {
            return 'ng-auth-oauth2-' + instanceName;
          },
          stateStoreKey: function (instanceName) {
            return 'ng-auth-oauth2-state-' + instanceName;
          },
          display: 'popup',
          redirectUri: function () {
            return $location.absUrl();
          },
          requestConfig: function (accessToken) {
            return { headers: { Authorization: 'Bearer ' + accessToken } };
          },
          authorizeUri: REQUIRED,
          clientId: REQUIRED,
          responseType: 'token',
          scopes: [],
          scope: function (scopes) {
            return scopes.join(' ');
          },
          extraParams: {},
          validateState: true,
          state: function () {
            var randChars = function () {
              return (Math.random() + 1).toString(36).substring(7);
            };
            return randChars() + randChars();
          },
          beforeAuth: function () {
            var d = $q.defer();
            d.resolve();
            return d.promise;
          },
          afterAuth: [function () {
              return function () {
                var d = $q.defer();
                d.resolve(arguments);
                return d.promise;
              };
            }],
          popup: {
            width: 650,
            height: 300,
            resizable: true,
            scrollbars: true,
            status: true
          }
        };
      // Override defaults with config
      config.popup = extend(defaults.popup, config.popup || {});
      config = extend(defaults, config || {});
      // Evaluate store key values for easier reference
      var storeKey = util.callIfFunction(config.storeKey, instanceName);
      var stateStoreKey = util.callIfFunction(config.stateStoreKey, instanceName);
      // Attempt to retrieve persisted data
      var accessTokenData = authStore.get(storeKey) || null;
      var accessToken = accessTokenData ? accessTokenData.access_token : null;
      if (accessTokenData) {
        // Run afterAuth if accessTokenData is loaded
        $injector.invoke(config.afterAuth)(accessTokenData).then(undefined, function () {
          // Purge data if afterAuth fails
          accessTokenData = null;
          accessToken = null;
          authStore.remove(storeKey);
        });
      }
      /* Object containing oauth popup references
       *
       * popup reference format: {
       *   window: <reference to popup-window>, 
       *   deferred: <getAccessToken() promise>
       * }
       */
      var popups = {};
      var parseAuthorizeData = function (data) {
        // Validate state parameter, compare to saved value
        if (config.validateState) {
          if (!data.state) {
            throw new Error('OAuth2 error: access_token provided but no state.');
          }
          var savedState = authStore.get(stateStoreKey);
          // Verify state matches
          if (savedState != data.state) {
            throw new Error('Oauth2 error: state mismatch');
          }
        }
        // Persist
        authStore.set(storeKey, data);
        accessTokenData = data;
        accessToken = data.access_token;
      };
      if (config.display == 'popup') {
        // Listen for message from oauth popups
        angular.element($window).bind('message', function (event) {
          var popup = event.source.name ? popups[event.source.name] : null;
          if (popup && event.source == popup.window && event.origin == $window.location.origin) {
            // Resolve promise
            if (event.data.access_token) {
              popup.deferred.resolve(event.data);
            } else {
              popup.reject(event.data);
            }
          }
        });
      }  // If display is 'redirect' we need to inspect window.location
         // to check for access_token in the URI fragment
      else if (!accessToken && hash.indexOf('access_token=') > -1) {
        // Parse fragment
        var params = {};
        forEach(hash.replace(/#\/|#/, '').split('&'), function (kv) {
          var kvSplit = kv.split('=');
          params[kvSplit[0]] = kvSplit[1];
        });
        parseAuthorizeData(params);
        // Re-direct to URL without oauth fragment
        $window.location.href = $location.absUrl().split('#')[0];
      }
      // Perform some cute config validation 
      var required = [];
      forEach(config, function (value, key) {
        if (value == REQUIRED) {
          required.push(key);
        }
      });
      if (required.length > 0) {
        throw new Error('OAuth2 configuration error, missing the following properties from config: ' + required.join(', '));
      }
      // Service result
      return {
        getAccessToken: function () {
          var authDeferred = $q.defer();
          // If there is an access token call afterAuth and resolve
          if (accessToken) {
            $injector.invoke(config.afterAuth)(accessTokenData).then(function () {
              authDeferred.resolve(accessToken);
            });
            return authDeferred.promise;
          }
          // authorization URI builder used by both popup and redirect methods
          var buildAuthUri = function () {
            var state = util.callIfFunction(config.state);
            authStore.set(stateStoreKey, state);
            // Minimum request parameters
            var params = {
                response_type: config.responseType,
                client_id: config.clientId,
                redirect_uri: util.callIfFunction(config.redirectUri),
                scope: config.scope(config.scopes),
                state: state
              };
            // add extra parameters from config
            params = extend(params, config.extraParams);
            return config.authorizeUri + '?' + objectToQueryString(params);
          };
          // Fetch access token with a redirect, return a promise
          var getAccessTokenByPopup = function () {
            var d = $q.defer();
            // Popup functionality drawn from angular-oauth
            // https://github.com/enginous/angular-oauth/
            var formatPopupParams = function (paramsObj) {
              var params = [];
              forEach(paramsObj, function (value, key) {
                if (value || value === 0) {
                  value = value === true ? 'yes' : value;
                  params.push(key + '=' + value);
                }
              });
              return params.join(',');
            };
            // Generate a random name to identify the popup
            var name = (Math.random() + 1).toString(36).substring(7);
            var popup = $window.open(buildAuthUri(), name, formatPopupParams(config.popup));
            popups[name] = {
              window: popup,
              deferred: d
            };
            // Remove popup from array after it has closed
            popup.onbeforeunload = function () {
              delete popups[popup.name];
            };
            return d.promise;
          };
          // Fetch access token with a redirect, no promise used as window.location is changed
          var getAccessTokenByRedirect = function () {
            // Redirect-based: call the beforeAuth action and begin flow
            $injector.invoke(config.beforeAuth).then(function () {
              $window.location.href = buildAuthUri();
            });
          };
          // Save reference to service scope for use with promises
          var service = this;
          config.beforeAuth.call(service).then(function () {
            if (config.display != 'popup') {
              getAccessTokenByRedirect();
              return authDeferred.promise;
            } else {
              getAccessTokenByPopup().then(function (data) {
                parseAuthorizeData(data);
                return data;
              }).then($injector.invoke(config.afterAuth)).then(function (data) {
                authDeferred.resolve(data);
              }, function (data) {
                authDeferred.reject(data);
              });
            }
          });
          return authDeferred.promise;
        },
        requestConfig: function () {
          return config.requestConfig(accessToken);
        },
        forgetAccessToken: function () {
          accessToken = null;
          authStore.remove(storeKey);
        },
        config: config,
        accessToken: accessToken,
        accessTokenData: accessTokenData
      };
    }
  ];
};
// Expose provider for strategy extension
module.constant('$$oauth2Provider', oauth2Provider);
// Auto-register the provider with ng-auth
module.config([
  'authProvider',
  function (authProvider) {
    authProvider.registerStrategy('oauth2', oauth2Provider);
  }
]);})(window, window.angular);