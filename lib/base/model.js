'use strict';

const MVA = require('@scola/mva');

class LoginModel extends MVA.Model.Storable {
  constructor(storage) {
    super(storage.setPrefix('LoginModel'), {
      error: null,
      token: null,
      username: ''
    });

    this.tmp = {
      loading: false
    };
  }

  getError() {
    return this.get('error');
  }

  setError(value) {
    return this.set('error', value);
  }

  isLoading() {
    return this.tmp.loading;
  }

  setLoading(value) {
    this.tmp.loading = value;
    return this;
  }

  getToken() {
    return this.get('token');
  }

  setToken(value) {
    return this.set('token', value);
  }

  getUsername() {
    return this.get('username');
  }

  setUsername(value) {
    return this.set('username', value);
  }
}

module.exports = LoginModel;
