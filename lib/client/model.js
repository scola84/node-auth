'use strict';

const CommonModel = require('../common/model.js');

class ClientModel extends CommonModel {
  constructor(validator, messenger, sessionStorage, localStorage) {
    super(validator, messenger, sessionStorage);

    this.localStorage = localStorage;

    this.setValues({
      permanent: false
    });
  }

  load() {
    super.load();

    this.values.permanent = this.localStorage.get('permanent', this.namespace);
    this.values.token = this.localStorage.get('token', this.namespace);

    return this;
  }

  isPermanent() {
    return this.get('permanent');
  }

  setPermanent(value) {
    if (value === null) {
      this.localStorage.delete('permanent', this.namespace);
    } else {
      this.localStorage.set('permanent', value, this.namespace);
    }

    return this.set('permanent', value);
  }

  setToken(value) {
    if (this.isPermanent()) {
      if (value === null) {
        this.localStorage.delete('token', this.namespace);
      } else {
        this.localStorage.set('token', value, this.namespace);
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
      .then(this.handleSigninToken.bind(this))
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
