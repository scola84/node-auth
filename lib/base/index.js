'use strict';

const DI = require('@scola/di');
const Storage = require('@scola/storage-browser');

const Model = require('./model');

class Module extends DI.Module {
  configure() {
    this.inject(Model).with(
      this.instance(Storage.Session),
      this.instance(Storage.Local)
    );
  }
}

module.exports = {
  Model,
  Module
};
