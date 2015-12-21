'use strict';

const DI = require('@scola/di');
const MVA = require('@scola/mva');
const Validator = require('@scola/validator');

const Base = require('../../base');
const AuthorizeAction = require('./action/authorize');
const StoreAction = require('./action/store');
const AuthorizeView = require('./view/authorize');

class Module extends DI.Module {
  configure() {
    this.addModule(MVA.Module);
    this.addModule(Base.Module);

    this.inject(MVA.Action.Dispatcher)
      .assignArgument(0, this.object({
        '@scola.auth.password.authorize': this.instance(AuthorizeAction),
        '@scola.auth.password.store': this.instance(StoreAction)
      }));

    this.inject(MVA.View.Dispatcher)
      .assignArgument(0, this.object({
        '@scola.auth.password.authorize': this.instance(AuthorizeView)
      }));

    this.inject(AuthorizeAction).with(
      this.instance(Validator),
      this.singleton(Base.Model),
      this.singleton(MVA.Helper.Messenger)
    );

    this.inject(StoreAction).with(
      this.singleton(Base.Model)
    );

    this.inject(AuthorizeView).with(
      this.singleton(Base.Model),
      this.instance(MVA.Action.Dispatcher)
    );
  }
}

module.exports = {
  Module,
  View: AuthorizeView
};
