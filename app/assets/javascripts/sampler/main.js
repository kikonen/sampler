"use strict";
angular
  .module('sampler', [
    'ngRoute',
    'ngResource',
    'ngCookies',
    'ng-auth',
    'ng-auth.strategies.basic',
    'sampler.home'])
  .config(function($httpProvider, $routeProvider, $locationProvider, authProvider) {
    console.log("config: sampler");
    $httpProvider.defaults.headers.common['X-CSRF-Token'] = $('meta[name=csrf-token]').attr('content');

    authProvider.register('basic', {
      strategy: 'basic'
    });

    $locationProvider.html5Mode(true);

    $routeProvider
      .otherwise({
        redirectTo: "/"
      });
  });
