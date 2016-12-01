/* jshint node: true */
'use strict';

var mergeTrees    = require('broccoli-merge-trees');
var path          = require('path');
var existsSync    = require('exists-sync');
var p             = require('ember-cli-preprocess-registry/preprocessors');
var Funnel        = require('broccoli-funnel');

var preprocessJs  = p.preprocessJs;


module.exports = {
  name: 'ember-cli-addon-tests',

  included(app) {
    var addons = app.options.emberCliAddonTests;
    if (Array.isArray(addons)) {
      this.registryAddons = app.registry.app.project.addons.filter(function(addon) {
        if (addons.indexOf(addon.name) !== -1) {
          console.log(addon.name)
          return true;
        } else {
          return false;
        }
      });
      this.appName = app.name;
      this.appRegistry = app.registry;
    } else {
      this.registryAddons = [];
    }
  },

  generateTestTreeForAddon(addon) {
    var treePath = path.join(addon.root, 'tests');
    console.log('Path: ' + treePath);
    var preprocessedTests;
    if (existsSync(treePath)) {
      var tree = new Funnel(treePath, {
        destDir: this.appName + '/tests'
      });
      console.log('Funnel for ' + addon.name +': ' + tree);
      preprocessedTests = preprocessJs(tree, '/tests', this.appName, {
        registry: this.appRegistry
      });
      console.log('Babel tree for ' + addon.name +': ' + preprocessedTests);
    } else {
      throw Error('Path to concatenate addon tests does not exist');
    }
    return preprocessedTests;
  },

  postprocessTree(type, tree) {
    var self = this;
    if (type === 'test' && this.registryAddons.length > 0) {
      var includedAddonTestTrees = this.registryAddons.map(function(addon) {
        return self.generateTestTreeForAddon(addon);
      });
      return mergeTrees(includedAddonTestTrees.concat(tree), {overwrite: true});
    } else {
      return tree;
    }
  }
};
