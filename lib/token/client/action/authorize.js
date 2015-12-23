'use strict';

const MVA = require('@scola/mva');

class AuthorizeAction extends MVA.Action.Abstract {
  constructor(validator, model, messenger) {
    super(validator);

    this.model = model;
    this.messenger = messenger;
  }

  process() {
    this.messenger.send(
      this.messenger.createMessage().setBody({
        name: '@scola.auth.token.authorize',
        data: {
          token: this.model.getToken()
        }
      })
    );
  }
}

module.exports = AuthorizeAction;
