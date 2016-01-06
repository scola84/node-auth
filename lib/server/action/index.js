'use strict';

const DI = require('@scola/di');
const MVA = require('@scola/mva');

const Model = require('../model');
const SigninPasswordAction = require('./signin/password');
const SigninTokenAction = require('./signin/token');

class Module extends DI.Module {
  configure() {
    this.addModule(MVA.Module);

    this.inject(MVA.Action.Dispatcher)
      .assignArgument(0, this.object({
        '@scola.auth.signin.password': this.instance(SigninPasswordAction),
        '@scola.auth.signin.token': this.instance(SigninTokenAction)
      }));

      this.inject(SigninPasswordAction).with(
        this.singleton(Model)
      );

      this.inject(SigninTokenAction).with(
        this.singleton(Model)
      );
  }
}

module.exports = {
  Module
};
