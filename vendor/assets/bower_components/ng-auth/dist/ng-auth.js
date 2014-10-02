(function(window, angular, undefined){
var module = angular.module('ng-auth.constants', []);
// Default actions from ngResource/resource.js
module.constant('defaultActions', {
  'get': { method: 'GET' },
  'save': { method: 'POST' },
  'query': {
    method: 'GET',
    isArray: true
  },
  'remove': { method: 'DELETE' },
  'delete': { method: 'DELETE' }
});
module.constant('REQUIRED', 'REQUIRED');
module.constant('util', {
  extendDeep: function (dst) {
    var extendDeep = function (dst) {
      angular.forEach(arguments, function (obj) {
        if (obj != dst) {
          angular.forEach(obj, function (value, key) {
            if (dst[key] && dst[key].constructor && dst[key].constructor === Object) {
              extendDeep(dst[key], value);
            } else {
              dst[key] = value;
            }
          });
        }
      });
      return dst;
    };
    return extendDeep.apply(null, arguments);
  },
  callIfFunction: function (obj) {
    return angular.isFunction(obj) ? obj.apply(null, Array.prototype.slice.call(arguments, 1)) : obj;
  }
});})(window, window.angular);
(function(window, angular, undefined){
var module = angular.module('ng-auth', [
    'ng',
    'ngResource',
    'ng-auth.constants'
  ]);
/**
 * ng-auth service
 */
module.provider('auth', [
  '$provide',
  'util',
  function ($provide, util) {
    var forEach = angular.forEach, extend = angular.extend;
    var strategyInstanceProviders = {};
    this.strategies = {};
    /**
   * Register an authorization method with ng-auth
   *
   * @param {string} Key for method
   * @param {function} Authorization provider constructor
   */
    this.registerStrategy = function (name, provider) {
      if (this.strategies[name]) {
        throw new Error('A strategy the name \'' + name + '\' has already been registered');
      }
      this.strategies[name] = provider;
    };
    /**
   * Register an authorization instance
   * The resulting constructed service can be fetched with auth.get()
   *
   * @param {string} Name of instance
   * @param {Object} Configuration to pass to authorization provider
   }
   */
    this.register = function (key, config) {
      // Require config object
      if (!config) {
        throw new Error('Authorization service requires configuration object. `authProvider.register(\'myApi\', config)`');
      }
      // Require method specification
      if (!config.strategy) {
        throw new Error('config.strategy required');
      }
      var strategy = this.strategies[config.strategy];
      // Require matching config method
      if (!strategy) {
        throw new Error('"' + config.strategy + '" does not match any registered authorization strategies');
      }
      strategyInstanceProviders[key] = new strategy(config, key);
    };
    // https://github.com/angular/angular.js/blob/master/src/ng/http.js
    var createShortMethods = function (http, methods, requestConfigFunc) {
      forEach(methods, function (name) {
        http[name] = function (url, config) {
          var config = extend(config || {}, {
              method: name,
              url: url
            });
          config = util.extendDeep(requestConfigFunc(), config);
          return http(config);
        };
      });
    };
    provider = this;
    this.$get = [
      '$injector',
      '$http',
      '$resource',
      'defaultActions',
      function ($injector, $http, $resource, defaultActions) {
        var services = {};
        forEach(strategyInstanceProviders, function (provider, key) {
          service = $injector.invoke(provider.$get);
          service.$http = function (requestConfig) {
            return $http(util.extendDeep(requestConfig, service.requestConfig()));
          };
          createShortMethods(service.$http, [
            'get',
            'delete',
            'head',
            'jsonp'
          ], service.requestConfig);
          // Provide auth-wrapped $resource service
          service.$resource = function (url, params, actions) {
            actions = extend(defaultActions, actions || {});
            // Iterate over all resource actions, adding requestConfig from auth service
            // TODO: Should a config parameter be provided to disable authorization on a per-action basis?
            forEach(actions, function (requestConfig) {
              requestConfig = util.extendDeep(requestConfig, service.requestConfig());
            });
            return $resource(url, params, actions);
          };
          services[key] = service;
        });
        // Service result
        return {
          get: function (key) {
            return services[key];
          },
          strategies: provider.strategies
        };
      }
    ];
  }
]);})(window, window.angular);
(function(window, angular, undefined){
var module = angular.module('ng-auth.store.cookie', ['ngCookies']);
/*
 * Cookie-based Storage Service
 */
module.factory('cookieStoreAdapter', [
  '$cookieStore',
  function ($cookieStore) {
    return {
      name: 'cookie',
      get: function (key) {
        return $cookieStore.get(key);
      },
      set: function (key, value) {
        $cookieStore.put(key, value);
      },
      remove: function (key) {
        $cookieStore.remove(key);
      }
    };
  }
]);})(window, window.angular);
(function(window, angular, undefined){
var module = angular.module('ng-auth.store.local', []);
/*
 * localStorage-based Storage Service
 */
module.factory('localStoreAdapter', [
  '$window',
  function ($window) {
    return {
      name: 'local',
      get: function (key) {
        return $window.localStorage.getItem(key) || undefined;
      },
      set: function (key, value) {
        $window.localStorage.setItem(key, value);
      },
      remove: function (key) {
        $window.localStorage.removeItem(key);
      }
    };
  }
]);})(window, window.angular);
(function(window, angular, undefined){
var module = angular.module('ng-auth.store.memory', []);
/*
 * Memory-based Storage Service
 */
module.factory('memoryStoreAdapter', function () {
  var store = {};
  return {
    name: 'memory',
    get: function (key) {
      return store[key];
    },
    set: function (key, value) {
      store[key] = value;
    },
    remove: function (key) {
      delete store[key];
    }
  };
});})(window, window.angular);
(function(window, angular, undefined){
var module = angular.module('ng-auth.store', ['ng-auth.store.memory']);
/*
 * Storage provider, defaults to in-memory
 */
module.provider('authStore', function () {
  var adapter = 'memory';
  this.adapter = function (value) {
    return value ? adapter = value : adapter;
  };
  this.$get = [
    '$injector',
    function ($injector) {
      return $injector.get(adapter + 'StoreAdapter');
    }
  ];
});})(window, window.angular);