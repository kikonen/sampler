"use strict";
angular
  .module('sampler.auth', ['ng-auth'] )
  .factory(
    "AuthenticationService",
    function(
      Restangular,
      $cookieStore,
      auth) {
      var basic = auth.get('basic');

      var state = {
        url: 'http://localhost:3001',
        api: '/auth/token',
        username: ''
      };

      function login(username, password) {
        console.log("login");
        console.log(state);
        $cookieStore.remove('auth_token');
        state.username = username;

        basic.credentials(username, password);

        Restangular.setBaseUrl(state.url);
        Restangular.one(state.api).get().then(
          function(auth) {
            console.log("login: OK");
            basic.forgetCredentials();
            console.log(auth);
          },
          function(data, status, headers, config) {
            console.log("login: FAIL");
            basic.forgetCredentials();
            console.log(status);
          });
      };

      function logout() {
        console.log("logout");
        console.log(state);

        Restangular.setBaseUrl(state.url);

        Restangular.one(state.api).remove().then(
          function(auth) {
            basic.forgetCredentials();
            $cookieStore.remove('auth_token');
          },
          function(data, status, headers, config) {
            basic.forgetCredentials();
            $cookieStore.remove('auth_token');
          });
      };

      return {
        setServer: function(url, api) {
          state.url = url;
          state.api = api;
        },
        getUrl: function() {
          return state.url;
        },
        getApi: function() {
          return state.api;
        },
        login: login,
        logout: logout
      };
    });
