"use strict";
// load all modules needed for "root"
angular
  .module('sampler.modules', [
    'sampler.shared.server',
    'sampler.shared.authentication',
    'sampler.hello',
    'sampler.home',
    'sampler.login',
    'sampler.root',
    'sampler.tasks',
    'sampler.user',
    'sampler.upload'
  ]);
