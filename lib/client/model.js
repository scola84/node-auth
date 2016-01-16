'use strict';

const CommonModel = require('../common/model.js');

class ClientModel extends CommonModel {
  constructor(validator, messenger, sessionStorage, localStorage) {
    super(validator, messenger, sessionStorage);

    this.localStorage = localStorage;
    this.setValue('@scola.auth.permanent', false);
  }

  load() {
    super.load();

    const localToken = this.localStorage.get('@scola.auth.token');

    if (localToken) {
      this.values['@scola.auth.token'] = localToken;
    }

    return this;
  }

  isPermanent() {
    return this.get('@scola.auth.permanent');
  }

  setPermanent(value) {
    return this.set('@scola.auth.permanent', value);
  }

  setToken(value) {
    if (this.isPermanent()) {
      if (typeof value === 'undefined') {
        this.localStorage.delete('@scola.auth.token');
      } else {
        this.localStorage.set('@scola.auth.token', value);
      }
    }

    return super.setToken(value);
  }

  signinPassword() {
    this.messenger
      .request('@scola.auth.signin.password', {
        username: this.getUsername(),
        password: this.getPassword()
      })
      .then(this.handleSigninPassword.bind(this))
      .catch(this.handleSigninError.bind(this));
  }

  signinToken() {
    this.messenger
      .request('@scola.auth.signin.token', {
        token: this.getToken()
      })
      .then(this.handleSigninToken.bind(this))
      .catch(this.handleSigninError.bind(this));
  }

  handleSigninPassword(data) {
    this
      .setPassword()
      .setToken(data.token)
      .setUserId(data.userId)
      .commit('signin-password-end');
  }

  handleSigninToken(data) {
    this
      .setUserId(data.userId)
      .commit('signin-token-end');
  }

  handleSigninError(data) {
    this
      .setUsername()
      .setPassword()
      .setToken()
      .setUserId()
      .setPermanent()
      .commit();

    this
      .setError()
      .emit('error', data);
  }
}

module.exports = ClientModel;
