'use strict';

const crypto = require('crypto');
const MVA = require('@scola/mva');

class SigninPasswordAction extends MVA.Action.Abstract {
  constructor(model) {
    super();
    this.model = model;
  }

  authorize() {
    return this;
  }

  execute(data, event) {
    const password = crypto
      .createHash('sha256')
      .update(data.password)
      .digest('hex');

    this.model
      .setUsername(data.username)
      .setPassword(password)
      .commit()
      .signinPassword(event);
  }
}

module.exports = SigninPasswordAction;
