import Ember from 'ember';
import {
  moduleForComponent as qunitModuleForComponent,
  moduleForModel as qunitModuleForModel,
  moduleFor as qunitModuleFor
} from 'ember-qunit';

let ctx = {};

const applyModuleToRegistry = function(modulePrefix) {
  const moduleRefObj = Ember.Object.extend({
    modulePrefix: modulePrefix
  });
  this.register('testmodule:prefix', moduleRefObj);
  ctx['context'] = this;
};

const wrapModuleFor = function(name, description, callbacks, wrappedFunc) {
  let modulePrefix;
  if (callbacks.modulePrefix) {
    modulePrefix = callbacks.modulePrefix;
  }
  if (callbacks.beforeEach) {
    const beforeEachRef = callbacks.beforeEach;

    callbacks.beforeEach = function() {
      beforeEachRef.apply(this);
      applyModuleToRegistry.apply(this, [modulePrefix]);
    };
  } else {
    callbacks.beforeEach = function() {
      applyModuleToRegistry.apply(this, [modulePrefix]);
    };
  }
  wrappedFunc(name, description, callbacks);
};

const moduleForComponent = function(name, description, callbacks) {
  wrapModuleFor(name, description, callbacks, qunitModuleForComponent);
};

const moduleFor = function(name, description, callbacks) {
  wrapModuleFor(name, description, callbacks, qunitModuleFor);
};

const moduleForModel = function(name, description, callbacks) {
  wrapModuleFor(name, description, callbacks, qunitModuleForModel);
};


export {
  moduleForComponent,
  moduleFor,
  moduleForModel,
  ctx
};