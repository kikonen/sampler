(function(window, angular, undefined){
var module = angular.module('ng-auth.strategies.google', [
    'ng-auth',
    'ng-auth.constants',
    'ng-auth.strategies.oauth2'
  ]);
/**
 * An OAuth 2.0 extension strategy for Google's APIs
 *
 * https://developers.google.com/accounts/docs/OAuth2#clientside
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
    authProvider.registerStrategy('google', function (config, instanceName) {
      var googleConfig = {
          requestConfig: function (accessToken) {
            return { params: { access_token: accessToken } };
          },
          authorizeUri: 'https://accounts.google.com/o/oauth2/auth',
          afterAuth: [
            '$q',
            '$http',
            function ($q, $http) {
              return function (data) {
                var d = $q.defer();
                $http.get('https://www.googleapis.com/oauth2/v1/tokeninfo', { params: { access_token: data.access_token } }).success(function (tokenInfoData) {
                  if (tokenInfoData.audience == config.clientId) {
                    d.resolve(data);
                  } else {
                    d.reject({ message: 'Google OAuth failure: tokeninfo audience does not match clientId' });
                  }
                }).error(function (tokenInfoData, status, headers, config) {
                  d.reject({
                    message: 'Google OAuth failure: tokeninfo response error',
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
      return new $$oauth2Provider(angular.extend(config, googleConfig), instanceName);
    });
  }
]);})(window, window.angular);