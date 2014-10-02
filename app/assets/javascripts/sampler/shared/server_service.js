"use strict";
angular
  .module('sampler.shared.server', [
  ])
  .factory(
    "Server",
    function(
      Restangular) {

      var url = '';

      function set(newUrl) {
        url = newUrl;
//        Restangular.setBaseUrl(newUrl);
      }

      return {
        set: set,
        get: function() {
          return url;
        }
      };
    });
