'use strict';

const MVA = require('@scola/mva');

class AuthorizeAction extends MVA.Action.Abstract {
  constructor(validator, config, messenger, jwt) {
    super(validator);

    this.config = config;
    this.messenger = messenger;
    this.jwt = jwt;
  }

  process(data, event) {
    let result = {};

    try {
      result = this.jwt.verify(
        data.token,
        this.config.get('auth.privateKey')
      );
    } catch (error) {
      result.error = error.message;
    }

    this.messenger.send(event.message.clone()
      .setMasked(false)
      .setBody({
        name: '@scola.auth.token.store',
        data: result
      })
    );
  }
}

module.exports = AuthorizeAction;
