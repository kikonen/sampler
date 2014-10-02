"use strict";
angular
  .module('sampler.task.service', [
  ])
  .factory(
    'TaskService',
    function(
      $q,
      $filter,
      Restangular) {

      var state = {
        base_url: 'api/tasks'
      };

      return {
        state: function() { return state; },
        all: function () {
          return Restangular.all(state.base_url).getList();
        },
        one: function (taskId, fn) {
          return Restangular.one(state.base_url, taskId).get();
        },
        create: function (fn) {
          var d = $q.defer(),
              task = {
                id: null,
                name: null,
                message: null,
                done: false
              };
          d.resolve(task);
          return d.promise;
        },
        delete: function(task) {
          return task.remove();
        },
        save: function(task) {
          if (task.id) {
            return task.save();
          } else {
            return Restangular.all(state.base_url).post(task);
          }
        },
        tableAll: function($defer, params) {
          Restangular.all(state.base_url).getList().then(function(tasks) {
            if (params.filter()) {
              tasks = $filter('filter')(tasks, params.filter());
            }
            if (params.sorting()) {
              tasks = $filter('orderBy')(tasks, params.orderBy());
            }
            var pg = params.page();
            var count = params.count();
            $defer.resolve(tasks.slice((pg - 1) * count, pg * count));
          });
        }
      };
    });
