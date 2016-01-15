'use strict';

const DI = require('@scola/di');
const I18n = require('@scola/i18n');
const MVA = require('@scola/mva');
const PresetView = require('@scola/mva-preset-view');

const Model = require('../model');
const SigninPasswordView = require('./signin/password');

class Module extends DI.Module {
  configure() {
    this.addModule(MVA.Module);
    this.addModule(PresetView.Module);

    this.inject(MVA.View.Dispatcher)
      .assignArgument(0, this.object({
        '@scola.auth.signin.password': this.instance(SigninPasswordView)
      }));

    this.inject(SigninPasswordView).with(
      this.singleton(Model),
      this.singleton(I18n.I18n)
    );
  }
}

module.exports = {
  Module
};
