'use strict';

const DI = require('@scola/di');
const Views = require('@scola/views');

const Base = require('./lib/base');
const Password = require('./lib/password');
const Token = require('./lib/token');

class Client extends DI.Module {
  configure() {
    this.addModule(Views.Module);
    this.addModule(Password.Client.Module);
    this.addModule(Token.Client.Module);
  }
}

class Server extends DI.Module {
  configure() {
    this.addModule(Password.Server.Module);
    this.addModule(Token.Server.Module);
  }
}

module.exports = {
  Base,
  Password,
  Token,
  Module: {
    Client,
    Server
  }
};
