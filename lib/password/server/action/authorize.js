'use strict';

const AbstractAuthorizeAction = require('../../common/action/authorize.js');
const crypto = require('crypto');

class AuthorizeAction extends AbstractAuthorizeAction {
  constructor(validator, config, messenger, jwt, storage) {
    super(validator);

    this.config = config;
    this.messenger = messenger;
    this.jwt = jwt;
    this.storage = storage;
  }

  validate(data) {
    return super.validate(data).valid;
  }

  process(data, event) {
    const shasum = crypto.createHash('sha256');
    shasum.update(data.password);
    data.password = shasum.digest('hex');

    this.storage
      .getUser(data)
      .then(this.handleUser.bind(this, event))
      .catch(this.handleError.bind(this, event));
  }

  handleUser(event, user) {
    if (!user) {
      return this.handleError(event, new Error('user_not_found'));
    }

    const token = this.jwt.sign({
      userId: user.user_id
    }, this.config.get('auth.privateKey'), {
      expiresIn: '7 days'
    });

    this.messenger.send(event.message.clone()
      .setMasked(false)
      .setBody({
        name: '@scola.auth.password.store',
        data: {
          token
        }
      })
    );
  }

  handleError(event, error) {
    this.messenger.send(event.message.clone()
      .setMasked(false)
      .setBody({
        name: '@scola.auth.password.store',
        data: {
          error: error.message
        }
      })
    );
  }
}

module.exports = AuthorizeAction;
