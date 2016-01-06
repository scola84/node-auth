'use strict';

const DI = require('@scola/di');
const MVA = require('@scola/mva');

const Model = require('../model');
const SigninPasswordView = require('./signin/password');

class Module extends DI.Module {
  configure() {
    this.addModule(MVA.Module);
    
    this.inject(MVA.View.Dispatcher)
      .assignArgument(0, this.object({
        '@scola.auth.signin.password': this.instance(SigninPasswordView)
      }));

    this.inject(SigninPasswordView).with(
      this.singleton(Model)
    );
  }
}

module.exports = {
  Module
};
