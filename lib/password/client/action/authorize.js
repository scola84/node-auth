'use strict';

const AbstractAuthorizeAction = require('../../common/action/authorize.js');

class AuthorizeAction extends AbstractAuthorizeAction {
  constructor(validator, model, messenger) {
    super(validator);

    this.model = model;
    this.messenger = messenger;
  }

  validate(data) {
    this.model
      .setLoading(true)
      .commit();

    this.model
      .setUsername(data.username);

    const result = super.validate(data);

    if (!result.valid) {
      this.model
        .setError(result)
        .setLoading(false);
    } else {
      this.model.setError(null);
    }

    this.model.commit();

    return result.valid;
  }

  process(data) {
    this.messenger.send(
      this.messenger.createMessage().setBody({
        name: '@scola.auth.password.authorize',
        data
      })
    );
  }
}

module.exports = AuthorizeAction;
