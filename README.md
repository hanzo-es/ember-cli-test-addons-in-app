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
  modulePrefix: 'my-private-addon'
});
 
testInModule('things tested here would work only in addon context', function(assert) {
  
  // test code omitted
  
});
 
test('things tested here would work in both addon context and app context', function(assert) {
  
  // test code omitted
  
});
```

In the example above special `moduleForComponent` is used instead of traditional provided by `ember-qunit`. This `moduleForComponent` takes advantage of `modulePrefix` property that you have to specify in your callbacks object and it should point to the module from which it originates as there is no way of knowing that at runtime.

After you specify your `modulePrefix` you are free to use the `testInModule` helper instead of `test`. `testInModule` would make sure that the test would run only in the context of addon itself and gets ignored in the app context. The `modulePrefix` provided in callbacks is compared to the one provided within your `config/environment.js` to make that decision.

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

## Installation

* `git clone <repository-url>` this repository
* `cd ember-cli-addon-tests`
* `npm install`
* `bower install`

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
