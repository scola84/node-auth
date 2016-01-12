'use strict';

const DI = require('@scola/di');
const MVA = require('@scola/mva');
const Storage = require('@scola/storage-browser');
const Validator = require('@scola/validator');

const I18n = require('./i18n');
const Model = require('./model');
const View = require('./view');

class Module extends DI.Module {
  configure() {
    this.addModule(MVA.Module);
    this.addModule(I18n.Module);
    this.addModule(View.Module);

    this.inject(Model).with(
      this.instance(Validator),
      this.singleton(MVA.Helper.Messenger),
      this.singleton(Storage.Session),
      this.singleton(Storage.Local)
    );
  }
}

module.exports = {
  Model,
  Module,
  View
};
