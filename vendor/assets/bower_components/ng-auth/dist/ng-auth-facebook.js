(function(window, angular, undefined){
var module = angular.module('ng-auth.strategies.facebook', [
    'ng-auth',
    'ng-auth.constants',
    'ng-auth.strategies.oauth2'
  ]);
/**
 * An OAuth 2.0 extension strategy for Facebook's APIs
 *
 * https://developers.facebook.com/docs/facebook-login/manually-build-a-login-flow
 * 
 * @constructor
 * @param {Object} config
 * @param {string} instanceName 
 */
module.config([
  '$$oauth2Provider',
  'authProvider',
  'REQUIRED',
  function ($$oauth2Provider, authProvider, REQUIRED) {
    authProvider.registerStrategy('facebook', function (config, instanceName) {
      var facebookConfig = {
          requestConfig: function (accessToken) {
            return { params: { access_token: accessToken } };
          },
          popup: {
            width: 445,
            height: 376,
            resizable: false,
            scrollbars: false,
            status: true
          },
          authorizeUri: 'https://www.facebook.com/dialog/oauth',
          scope: function (scopes) {
            return scopes.join(',');
          },
          afterAuth: [
            '$q',
            '$http',
            function ($q, $http) {
              return function (data) {
                var d = $q.defer();
                $http.get('https://graph.facebook.com/debug_token', {
                  params: {
                    input_token: data.access_token,
                    access_token: data.access_token
                  }
                }).success(function (tokenInfoData) {
                  if (tokenInfoData.data.app_id == config.clientId) {
                    d.resolve(data);
                  } else {
                    d.reject({ message: 'Facebook OAuth failure: token app_id does not match config.clientId' });
                  }
                }).error(function (tokenInfoData, status, headers, config) {
                  d.reject({
                    message: 'Facebook OAuth failure: token inspection response error',
                    tokenInfoData: tokenInfoData,
                    status: status,
                    headers: headers,
                    config: config
                  });
                });
                return d.promise;
              };
            }
          ]
        };
      return new $$oauth2Provider(angular.extend(config, facebookConfig), instanceName);
    });
  }
]);})(window, window.angular);