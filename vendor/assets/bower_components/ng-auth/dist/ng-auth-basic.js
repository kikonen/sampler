(function(window, angular, undefined){
/**
*
*  Base64 encode / decode adopted from
*  http://www.webtoolkit.info/javascript-base64.html
*
**/
angular.module('common.base64', []).factory('base64', function () {
  var keyStr = 'ABCDEFGHIJKLMNOP' + 'QRSTUVWXYZabcdef' + 'ghijklmnopqrstuv' + 'wxyz0123456789+/' + '=';
  return {
    encode: function (input) {
      var output = '';
      var chr1, chr2, chr3 = '';
      var enc1, enc2, enc3, enc4 = '';
      var i = 0;
      do {
        chr1 = input.charCodeAt(i++);
        chr2 = input.charCodeAt(i++);
        chr3 = input.charCodeAt(i++);
        enc1 = chr1 >> 2;
        enc2 = (chr1 & 3) << 4 | chr2 >> 4;
        enc3 = (chr2 & 15) << 2 | chr3 >> 6;
        enc4 = chr3 & 63;
        if (isNaN(chr2)) {
          enc3 = enc4 = 64;
        } else if (isNaN(chr3)) {
          enc4 = 64;
        }
        output = output + keyStr.charAt(enc1) + keyStr.charAt(enc2) + keyStr.charAt(enc3) + keyStr.charAt(enc4);
        chr1 = chr2 = chr3 = '';
        enc1 = enc2 = enc3 = enc4 = '';
      } while (i < input.length);
      return output;
    },
    decode: function (input) {
      var output = '';
      var chr1, chr2, chr3 = '';
      var enc1, enc2, enc3, enc4 = '';
      var i = 0;
      // remove all characters that are not A-Z, a-z, 0-9, +, /, or =
      var base64test = /[^A-Za-z0-9\+\/\=]/g;
      if (base64test.exec(input)) {
        alert('There were invalid base64 characters in the input text.\n' + 'Valid base64 characters are A-Z, a-z, 0-9, \'+\', \'/\',and \'=\'\n' + 'Expect errors in decoding.');
      }
      input = input.replace(/[^A-Za-z0-9\+\/\=]/g, '');
      do {
        enc1 = keyStr.indexOf(input.charAt(i++));
        enc2 = keyStr.indexOf(input.charAt(i++));
        enc3 = keyStr.indexOf(input.charAt(i++));
        enc4 = keyStr.indexOf(input.charAt(i++));
        chr1 = enc1 << 2 | enc2 >> 4;
        chr2 = (enc2 & 15) << 4 | enc3 >> 2;
        chr3 = (enc3 & 3) << 6 | enc4;
        output = output + String.fromCharCode(chr1);
        if (enc3 != 64) {
          output = output + String.fromCharCode(chr2);
        }
        if (enc4 != 64) {
          output = output + String.fromCharCode(chr3);
        }
        chr1 = chr2 = chr3 = '';
        enc1 = enc2 = enc3 = enc4 = '';
      } while (i < input.length);
      return output;
    }
  };
});})(window, window.angular);
(function(window, angular, undefined){
var module = angular.module('ng-auth.strategies.basic', [
    'common.base64',
    'ng-auth',
    'ng-auth.store'
  ]);
/**
 * ng-auth provider for HTTP Basic Authorization
 *
 * @constructor
 * @param {Object} config
 * @param {string} instanceName 
 */
var basicAuthProvider = function (config, instanceName) {
  // Configuration defaults 
  var defaults = {
      storeKey: function (instanceName) {
        return 'ng-auth-basic-' + instanceName;
      }
    };
  var config = angular.extend(defaults, config || {});
  // Service constructor, constructed by ng-auth using $injector.invoke when the 
  // user registers a new instance of this authorization method.
  this.$get = [
    'authStore',
    'base64',
    'util',
    function (authStore, base64, util) {
      // Attempt to fetch saved credentials
      var encodedCredentials = authStore.get(storeKey) || null;
      var storeKey = util.callIfFunction(config.storeKey, instanceName);
      // Service result
      return {
        credentials: function (login, password) {
          // Get
          if (!login && !password) {
            return encodedCredentials;
          }
          // Set
          encodedCredentials = base64.encode(login + ':' + password);
          authStore.set(storeKey, encodedCredentials);
        },
        requestConfig: function () {
          return encodedCredentials ? { headers: { Authorization: 'Basic ' + encodedCredentials } } : {};
        },
        forgetCredentials: function () {
          encodedCredentials = null;
          authStore.remove(storeKey);
        },
        config: config
      };
    }
  ];
};
// Expose provider for strategy extension
module.constant('$$basicAuthProvider', basicAuthProvider);
// Auto-register the provider with ng-auth 
module.config([
  'authProvider',
  function (authProvider) {
    authProvider.registerStrategy('basic', basicAuthProvider);
  }
]);})(window, window.angular);