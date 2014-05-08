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
        console.log("login");
        $cookieStore.remove('auth_token');

        basic.credentials(username, password);

        Restangular.one(state.api).get().then(
          function() {
            console.log("login: OK");
            state.username = username;
            basic.forgetCredentials();
            console.log(auth);
          },
          function() {
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
