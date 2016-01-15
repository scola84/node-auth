'use strict';

const Configuration = require('@scola/config');
const DI = require('@scola/di');
const MVA = require('@scola/mva');
const Validator = require('@scola/validator');
const Jwt = require('jsonwebtoken');

const Action = require('./action');
const Model = require('./model');

class Module extends DI.Module {
  configure() {
    this.addModule(MVA.Module);
    this.addModule(Validator.Module);

    this.addModule(Action.Module);

    this.inject(Model).with(
      this.instance(Validator.Validator),
      this.singleton(MVA.Helper.Messenger),
      this.value(null),
      this.singleton(Configuration),
      this.value(Jwt)
    );
  }
}

module.exports = {
  Action,
  Model,
  Module
};
