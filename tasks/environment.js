module.exports = function (grunt) {
  'use strict';

  var EnvironmentManager = require('./utils/EnvironmentManager');

  grunt.registerTask('environment', 'Replace text patterns with a given replacement.', function (target) {

    var options = this.options({});
    var manager = new EnvironmentManager(grunt, options);

    manager.injectEnvironmentSettings();

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