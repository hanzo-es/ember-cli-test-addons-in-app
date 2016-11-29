# Ember-cli-addon-tests

This README outlines the details of collaborating on this Ember addon.

## Background

In many Ember applications especially in those meant for enterprise sector Ember apps being developed are split into addons according to their purpose. There is also a need to run tests for those private sourced addons not just separately in the addon itself but also within the context of the application using those addon. This addon suits that purpose and allows to specify your app addons for which you want to concatenate the tests with your app in development and test builds by providing a config in `ember-cli-build.js` :
 
```js
module.exports = function (defaults) {
  var app = new EmberApp(defaults, {
    emberCliAddonTests: [
      'my-private-addon',
      'my-other-private-addon'
    ]
  });

  return app.toTree();
};
```

Such config would add `my-private-addon` and `my-other-private-addon` tests to your app tests and run them in the test context of your application.

## Installation

* `ember install ember-cli-addon-tests`

## Running tests only in addon context

After concatenation some of addon tests would fail as some addon pieces might be `extended` or `reopened` in the app or generally the app context might be different from the one in the addon. To mitigate those issues the special test helpers are provided that would help to run some of the tests only in proper context:

```js
import { 
  moduleForComponent, 
  testInModule 
} from 'ember-cli-addon-tests';
 
import { test } from 'ember-qunit';
 
moduleForComponent('some component', 'Integration | Component | some component', {
  integration: true,
  modulePrefixes: ['my-private-addon']
});
 
testInModule('things tested here would work only in addon context', function(assert) {
  
  // test code omitted
  
});
 
test('things tested here would work in both addon context and app context', function(assert) {
  
  // test code omitted
  
});
```

In the example above special `moduleForComponent` is used instead of traditional provided by `ember-qunit`. This `moduleForComponent` takes advantage of `modulePrefixes` property that you have to specify in your callbacks object and it should be an Array of modules.

After you specify your `modulePrefixes` you are free to use the `testInModule` helper instead of `test`. `testInModule` would make sure that the test would run only in the context of addons or apps specified in `modulePrefixes` and gets ignored in other contexts. The `modulePrefixes` provided in callbacks are compared to the one provided within your `config/environment.js` to make that decision.

The test that should always run should be ran with `test` from `ember-qunit`

This addon provides the following helpers:

```js
import { 
  moduleForComponent,
  module,
  moduleForModel,
  moduleFor,
  testInModule 
} from 'ember-cli-addon-tests';
```

## Caveats

- For now the default behaviour of tests concatenation is `overwrite`. Meaning if you have `tests/unit/my-awesome-test.js` in your `my-private-addon` addon and you also have `tests/unit/my-awesome-test.js` in the consuming app that uses `ember-cli-addon-tests` to concatenate tests from `my-private-addon` you would end up with just a single `tests/unit/my-awesome-test.js` originating from your app and not from `my-private-addon`. `ember-cli-addon-tests` does not currently provide any ways to alter this behaviour with renaming tests from addons but we are open for PR's for implementations of such feature.

- As qunit and ember-qunit `module` helper runs with no context there is no way to know what app/addon context we are using at runtime so the original `module` is swapped for call to `moduleFor` with `config:environment` as the `name`. This alters the test context behaviour and bootstraps isolated app container as `moduleFor` normally does. This allows to mute the tests for addon Mixins which are reopened in the app or other addons.

## Running

* `ember serve`
* Visit your app at [http://localhost:4200](http://localhost:4200).

## Running Tests

* `npm test` (Runs `ember try:each` to test your addon against multiple Ember versions)
* `ember test`
* `ember test --server`

## Building

* `ember build`

For more information on using ember-cli, visit [http://ember-cli.com/](http://ember-cli.com/).
