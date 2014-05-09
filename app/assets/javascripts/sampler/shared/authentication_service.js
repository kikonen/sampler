"use strict";
angular
  .module('sampler.shared.authentication', [
    'ng-auth',
    'ng-auth.strategies.basic',
    'sampler.shared.server'
  ])
  .config(function(
    authProvider) {
    authProvider.register('basic', {
      strategy: 'basic'
    });
  })
  .factory(
    "Authentication",
    function(
      Restangular,
      $cookieStore,
      auth,
      Server) {
      var basic = auth.get('basic');

      var state = {
        api: '/auth/token',
        username: null
      };

      function login(username, password) {
        var url = Server.get() + state.api;
        console.log("login: " + url);
        $cookieStore.remove('auth_token');

        basic.credentials(username, password);

        basic.$http({method: 'GET', url: url, withCredentials: true})
          .success(function(data, status, headers, config) {
            console.log("login: OK");
            state.username = username;
            basic.forgetCredentials();
          })
          .error(function(data, status, headers, config) {
            console.log("login: FAIL");
            basic.forgetCredentials();
          });
      };

      function logout() {
        console.log("logout");
        Restangular.one(state.api).remove().then(
          function() {
            basic.forgetCredentials();
            $cookieStore.remove('auth_token');
          },
          function() {
            basic.forgetCredentials();
            $cookieStore.remove('auth_token');
            state.username = null;
          });
      };

      return {
        setApi: function(api) {
          state.api = api;
        },
        getApi: function() {
          return state.api;
        },
        getUser: function() {
          return state.username;
        },
        login: login,
        logout: logout
      };
    });
