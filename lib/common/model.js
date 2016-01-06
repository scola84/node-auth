'use strict';

const MVA = require('@scola/mva');

class CommonModel extends MVA.Model.Abstract {
  constructor(validator, messenger, storage) {
    super(validator, messenger, storage);

    this.setValues({
      username: null,
      password: null,
      token: null,
      userId: null
    }, '@scola.auth');
  }

  getUsername() {
    return this.get('username');
  }

  setUsername(username) {
    return this.set('username', username, {
      type: 'string',
      length: [1]
    });
  }

  getPassword() {
    return this.get('password');
  }

  setPassword(password) {
    return this.set('password', password, {
      type: 'string',
      length: [1]
    });
  }

  getToken() {
    return this.get('token');
  }

  setToken(value) {
    return this.set('token', value);
  }

  getUserId() {
    return this.get('userId');
  }

  setUserId(value) {
    return this.set('userId', value);
  }
}

module.exports = CommonModel;
