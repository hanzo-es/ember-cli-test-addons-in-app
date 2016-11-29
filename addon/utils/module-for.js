import {
  moduleForComponent as qunitModuleForComponent,
  moduleForModel as qunitModuleForModel,
  moduleFor as qunitModuleFor
} from 'ember-qunit';

let ctx;

const populateCallbacks = function(callbacks, isModule) {
  let modulePrefixes;
  if (callbacks.modulePrefixes) {
    modulePrefixes = callbacks.modulePrefixes;
  }
  if (callbacks.beforeEach) {
    const beforeEachRef = callbacks.beforeEach;

    callbacks.beforeEach = function() {
      beforeEachRef.apply(this);
      ctx = modulePrefixes;
    };
  } else {
    callbacks.beforeEach = function() {
      ctx = modulePrefixes;
    };
  }
  if (callbacks.afterEach) {
    const afterEachRef = callbacks.afterEach;

    callbacks.afterEach = function() {
      afterEachRef.apply(this);
      ctx = null;
    };
  } else {
    callbacks.afterEach = function() {
      ctx = null;
    };
  }
  if ((callbacks.needs || !callbacks.integration || callbacks.unit) && !isModule) {
    if (!callbacks.needs) {
      callbacks.needs = ['config:environment'];
    } else if (callbacks.needs.indexOf('config:environment') === -1) {
      callbacks.needs.push('config:environment');
    }
  }
  return callbacks;
};

const wrapModuleFor = function(name, description, callbacks, wrappedFunc, isModule=false) {
  if (callbacks) {
    populateCallbacks(callbacks, isModule);
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

const module = function(description, callbacks) {
  wrapModuleFor('config:environment', description, callbacks, qunitModuleFor, true);
};


export {
  moduleForComponent,
  moduleFor,
  moduleForModel,
  module,
  ctx
};