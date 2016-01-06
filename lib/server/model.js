'use strict';

const CommonModel = require('../common/model.js');

class ServerModel extends CommonModel {
  constructor(validator, messenger, dbStorage, config, jwt) {
    super(validator, messenger);

    this.db = dbStorage;
    this.config = config;
    this.jwt = jwt;
  }

  signinPassword(event) {
    this.db
      .getUser(this.getUsername(), this.getPassword())
      .then(this.handleUser.bind(this, event))
      .catch(this.messenger.handleError.bind(this.messenger, event));
  }

  signinToken(event) {
    this.reply(event, this.jwt.verify(
      this.getToken(),
      this.config.get('@scola.auth.privateKey')
    ));
  }

  handleUser(event, user) {
    if (!user) {
      throw new Error('@scola.auth.user-not-found');
    }

    const token = this.jwt.sign({
      userId: user.user_id
    }, this.config.get('@scola.auth.privateKey'), {
      expiresIn: '7 days'
    });

    this.reply(event, {
      token,
      userId: user.user_id
    });
  }
}

module.exports = ServerModel;
