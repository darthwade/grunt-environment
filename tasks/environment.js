module.exports = function (grunt) {
  'use strict';

  var EnvironmentManager = require('../utils/EnvironmentManager.js');

  grunt.registerTask('environment', 'Replace text patterns with a given replacement.', function (target) {

    var options = grunt.config.get('environment');
    var manager = new EnvironmentManager(grunt, options);

    if (target) {
      // Set environment
      manager.setEnvironment(target);
    } else {
      // Get environment
      var activeEnv = manager.getActiveEnvironment();

      // Set default environment
      manager.setEnvironment(activeEnv);

      if (activeEnv) {
        grunt.log.ok('Active environment: ' + activeEnv);
      } else {
        grunt.log.error('No active environment.');
      }
    }
  });
};