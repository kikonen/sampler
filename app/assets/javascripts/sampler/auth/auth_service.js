"use strict";
angular
  .module('sampler.auth', ['ng-auth'] )
  .factory(
    "AuthenticationService",
    function($http, $cookies, $cookieStore, auth) {
      var basic = auth.get('basic');

      var state = {
        url: 'http://localhost:3000',
        api: '/auth/token',
        username: ''
      };

      function login(username, password) {
        console.log(state);
        $cookieStore.remove('auth_token');
        state.username = username;

        basic.credentials(username, password);
        var url = "" + state.url + state.api;
        console.log("login: " + url);

        basic.$http({method: 'GET', url: url, withCredentials: true, Authentication: 'xxx:yyy'})
          .success(function(data, status, headers, config) {
            console.log(status);
            console.log($cookies);
          })
          .error(function(data, status, headers, config) {
            console.log(status);
            console.log("login: FAIL");
          });
      };

      function logout() {
        var url = state.url + state.api;
        console.log("logout: " + url);

        basic.$http({method: 'DELETE', url: url})
          .success(function(data, status, headers, config) {
            $cookieStore.remove('auth_token');
            basic.forgetCredentials();
          })
          .error(function(data, status, headers, config) {
            $cookieStore.remove('auth_token');
            basic.forgetCredentials();
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
