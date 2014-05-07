"use strict";
angular
  .module('sampler.task.service', [
    'sampler.auth'
  ])
  .factory(
    'TaskService',
    function(
      $filter,
      Restangular,
      AuthenticationService) {

      var state = {
        base_url: '/api/tasks'
      };

      return {
        state: function() { return state; },
        all: function (fn) {
          Restangular.all(state.base_url).getList().then(fn);
        },
        one: function (taskId, fn) {
          Restangular.one(state.base_url, taskId).get().then(fn);
        },
        create: function (fn) {
          var task = {
            id: null,
            name: null,
            message: null,
            done: false
          };
          fn(task);
        },
        delete: function(task, fn) {
          task.remove().then(fn);
        },
        save: function(task, fn) {
          if (task.id) {
            task.save().then(fn);
          } else {
            Restangular.all(state.base_url).post(task).then(fn);
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
