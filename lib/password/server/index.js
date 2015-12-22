'use strict';

const Configuration = require('@scola/config');
const DI = require('@scola/di');
const MVA = require('@scola/mva');
const Validator = require('@scola/validator');
const jwt = require('jsonwebtoken');

const AuthorizeAction = require('./authorize');

class Module extends DI.Module {
  configure() {
    this.addModule(MVA.Module);

    this.inject(MVA.Action.Dispatcher)
      .assignArgument(0, this.object({
        '@scola.auth.password.authorize': this.instance(AuthorizeAction)
      }));

    this.inject(AuthorizeAction).with(
      this.instance(Validator),
      this.singleton(Configuration),
      this.singleton(MVA.Helper.Messenger),
      this.value(jwt)
    );
  }
}

module.exports = {
  Module,
  Authorize: AuthorizeAction
};
