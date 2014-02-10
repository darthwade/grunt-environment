module.exports = function () {
  'use strict';

  var path = require('path');
  var fs = require('fs');

  return function(grunt, options) {
    var self = this;

    options = grunt.util._.extend({}, {
      src: './settings',
      format: 'yaml',
      default: 'default',
      active: 'local',
      configVariable: 'settings',
      envFilePath: '.environment' // Relative to src dir
    }, options);

    var importers = {
      'yaml': {
        ext: '.yml',
        read: function(path) {
          return grunt.file.readYAML(path);
        }
      },
      'json': {
        ext: '.json',
        read: function(path) {
          return grunt.file.readJSON(path);
        }
      },
      'js': {
        ext: '.js',
        read: function(path) {
          var settings = require(path);
          return grunt.util._.isFunction(settings) ? settings(grunt) : settings;
        }
      }
    };

    if (!importers.hasOwnProperty(options.format)) {
      throw new Error('There is no "' + options.format + '" format.');
    }

    var importer = importers[options.format];

    var getSettingsPath = function(env) {
      return path.join(options.src, env + importer.ext);
    };

    var loadSettings = function(env) {
      var filePath = getSettingsPath(env);
      if (grunt.file.exists(filePath)) {
        return importer.read(filePath);
      } else {
        throw new Error('Configuration file "' + filePath + '" does not exists.');
      }
    };

    self.getActiveEnvironment = function() {
      var filePath = path.join(options.src, options.envFilePath);
      if (fs.existsSync(filePath)) {
        return fs.readFileSync(filePath, 'utf8').trim();
      }

      // If file doesn't exists return default active env
      return options.active;
    };

    self.setEnvironment = function(env) {
      var settingsFilePath = getSettingsPath(env);
      if (!grunt.file.exists(settingsFilePath)) {
        throw new Error('Environment "' + env + '" doesn\'t exists');
      }

      var filePath = path.join(options.src, options.envFilePath);
      var fd = fs.openSync(filePath, 'w+');
      var buf = new Buffer(env);
      fs.writeSync(fd, buf, 0, buf.length, 0);
      fs.close(fd);

      grunt.config.set(options.configVariable, self.getEnvironmentSettings());
    };

    self.getEnvironmentSettings = function() {
      var defaultSettings = loadSettings(options.default);

      var activeEnv = self.getActiveEnvironment();
      var settings = loadSettings(activeEnv);
      return grunt.util._.extend({}, defaultSettings, settings);
    };

    self.injectEnvironmentSettings = function() {
      var activeEnv = self.getActiveEnvironment();

      // Set default environment
      self.setEnvironment(activeEnv);
    }

  };
};