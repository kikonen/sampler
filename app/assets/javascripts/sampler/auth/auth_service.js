"use strict";
angular
  .module('sampler.auth', ['ng-auth'] )
  .service(
    "AuthenticationService",
     function($http, $cookies, $cookieStore, auth) {
       var basic = auth.get('basic');

       var state = {
         server: '',
         username: ''
       };

       this.authenticated = function() {
         return !!$cookies.auth_token;
       };

       this.login = function(server, username, password, api) {
         $cookieStore.remove('auth_token');
         state.username = username;
         state.server = server;

         basic.credentials(username, password);
         var url = server + api;
         console.log(server);
         console.log("login: " + url);

         basic.$http({method: 'GET', url: url, withCredentials: true, Authentication: 'xxx:yyy'})
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

       this.logout = function(api) {
         console.log("logout: " + state.server);
         var url = state.server + api;
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
     });
