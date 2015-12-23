'use strict';

const MVA = require('@scola/mva');

class LoginModel extends MVA.Model.Storable {
  constructor(sessionStorage, localStorage) {
    super(sessionStorage.setPrefix('@scola.auth'), {
      error: null,
      token: null,
      userId: null
    });

    this.localStorage = localStorage.setPrefix('@scola.auth');

    this.tmp = {
      loading: false,
      permanent: false
    };
  }

  load() {
    this.values.token = this.localStorage.get('token');
    return super.load();
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

  isPermanent() {
    return this.tmp.permanent;
  }

  setPermanent(value) {
    this.tmp.permanent = value;
  }

  getToken() {
    return this.get('token');
  }

  setToken(value) {
    if (this.isPermanent()) {
      this.localStorage.set('token', value);
    }

    return this.set('token', value);
  }

  getUserId() {
    return this.get('userId');
  }

  setUserId(value) {
    return this.set('userId', value);
  }
}

module.exports = LoginModel;
