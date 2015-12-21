'use strict';

const DI = require('@scola/di');
const Views = require('@scola/views');

const Base = require('./lib/base');
const Password = require('./lib/password');

class Client extends DI.Module {
  configure() {
    this.addModule(Views.Module);
    this.addModule(Password.Client.Module);
  }
}

class Server extends DI.Module {
  configure() {
    this.addModule(Password.Server.Module);
  }
}

module.exports = {
  Base,
  Password,
  Module: {
    Client,
    Server
  }
};
