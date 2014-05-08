"use strict";
angular
  .module('sampler.shared.server', [
  ])
  .factory(
    "Server",
    function(
      Restangular) {

      var url = 'http://localhost:3001';

      function set(url) {
        url = url;
        Restangular.setBaseUrl(url);
      }

      return {
        set: set,
        get: function() {
          return url;
        }
      };
    });
