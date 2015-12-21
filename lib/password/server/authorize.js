'use strict';

const AbstractAuthorizeAction = require('../common/authorize.js');

class AuthorizeAction extends AbstractAuthorizeAction {
  constructor(validator, messenger) {
    super(validator);
    this.messenger = messenger;
  }

  validate(data) {
    return super.validate(data).valid;
  }

  process(data, event) {
    this.messenger.send(event.message.clone()
      .setMasked(false)
      .setBody({
        name: '@scola.auth.password.store',
        data: {
          token: 'abcdef'
        }
      })
    );
  }
}

module.exports = AuthorizeAction;
