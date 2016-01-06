'use strict';

const MVA = require('@scola/mva');

class SigninTokenAction extends MVA.Action.Abstract {
  constructor(model) {
    super();
    this.model = model;
  }

  authorize() {
    return this;
  }

  execute(data, event) {
    this.model
      .setToken(data.token)
      .commit()
      .signinToken(event);
  }
}

module.exports = SigninTokenAction;
