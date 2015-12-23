'use strict';

const DI = require('@scola/di');
const MVA = require('@scola/mva');
const Validator = require('@scola/validator');

const Base = require('../../base');
const AuthorizeAction = require('./action/authorize');
const StoreAction = require('./action/store');

class Module extends DI.Module {
  configure() {
    this.addModule(MVA.Module);
    this.addModule(Base.Module);

    this.inject(MVA.Action.Dispatcher)
      .assignArgument(0, this.object({
        '@scola.auth.token.authorize': this.instance(AuthorizeAction),
        '@scola.auth.token.store': this.instance(StoreAction)
      }));

    this.inject(AuthorizeAction).with(
      this.instance(Validator),
      this.singleton(Base.Model),
      this.singleton(MVA.Helper.Messenger)
    );

    this.inject(StoreAction).with(
      this.singleton(Base.Model)
    );
  }
}

module.exports = {
  Module
};
