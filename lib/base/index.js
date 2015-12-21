'use strict';

const DI = require('@scola/di');
const Storage = require('@scola/storage-browser');

const Model = require('./model');

class Module extends DI.Module {
  configure() {
    this.inject(Model)
      .with(this.singleton(Storage.Session));
  }
}

module.exports = {
  Model,
  Module
};
