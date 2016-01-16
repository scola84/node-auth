'use strict';

const MVA = require('@scola/mva');

class CommonModel extends MVA.Model.Abstract {
  constructor(validator, messenger, storage) {
    super(validator, messenger, storage);

    this
      .setValue('@scola.auth.username', null)
      .setValue('@scola.auth.password', null)
      .setValue('@scola.auth.token', null)
      .setValue('@scola.auth.userId', null);
  }

  getUsername() {
    return this.get('@scola.auth.username');
  }

  setUsername(username) {
    return this.set('@scola.auth.username', username, {
      type: 'string',
      required: true,
      length: [1, 255]
    });
  }

  getPassword() {
    return this.get('@scola.auth.password');
  }

  setPassword(password) {
    return this.set('@scola.auth.password', password, {
      type: 'string',
      required: true,
      length: [1, 255]
    });
  }

  getToken() {
    return this.get('@scola.auth.token');
  }

  setToken(value) {
    return this.set('@scola.auth.token', value);
  }

  getUserId() {
    return this.get('@scola.auth.userId');
  }

  setUserId(value) {
    return this.set('@scola.auth.userId', value);
  }
}

module.exports = CommonModel;
