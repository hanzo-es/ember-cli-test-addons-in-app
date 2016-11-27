import { test as qunitTest } from 'ember-qunit';
import { ctx } from './module-for';

const testInModule = function(name, testFunc) {

  function testWrapper(assert) {
    const prefix = ctx;
    const registeredModulePrefix = this.container.lookup('testmodule:prefix').modulePrefix;
    const currentModulePrefix = this.container.lookupFactory('config:environment').modulePrefix;
    if (!registeredModulePrefix) {
      testFunc(assert);
    } else {
      if (registeredModulePrefix === currentModulePrefix) {
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