import { test as qunitTest } from 'ember-qunit';
import { ctx } from './module-for';

const testInModule = function(name, testFunc) {

  function testWrapper(assert) {
    const registeredModulePrefixes = ctx;
    const currentModulePrefix = this.container.lookupFactory('config:environment').modulePrefix;
    if (!registeredModulePrefixes || registeredModulePrefixes.length === 0) {
      testFunc(assert);
    } else {
      if (registeredModulePrefixes.indexOf(currentModulePrefix) > -1) {
        testFunc(assert);
      } else {
        assert.expect(0);
      }
    }
  }
  qunitTest(name, testWrapper);
};

export {
  testInModule
};