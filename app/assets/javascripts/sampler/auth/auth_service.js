"use strict";
angular
  .module('sampler.auth', ['ng-auth'] )
  .service(
    "AuthenticationService",
    ["$http", "$cookies", "$cookieStore", "auth",
     function($http, $cookies, $cookieStore, auth) {
       var basic = auth.get('basic');

       var state = {
         server: '',
         username: ''
       };

       this.authenticated = function() {
         return !!$cookies.auth_token;
       };

       this.login = function(server, username, password) {
         $cookieStore.remove('auth_token');
         state.username = username;
         state.server = server;

         basic.credentials(username, password);
         var url = server + '/api/login';
         console.log(server);
         console.log("login: " + url);

         basic.$http({method: 'GET', url: url, Authentication: 'xxx:yyy'})
           .success(function(data, status, headers, config) {
             console.log(status);
             console.log("login: SUCCESS");
             console.log($cookies);
           })
           .error(function(data, status, headers, config) {
             console.log(status);
             console.log("login: FAIL");
           });
       };

       this.logout = function() {
         console.log("logout: " + server);
         var url = state.server + '/api/logout';
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
     }]);
