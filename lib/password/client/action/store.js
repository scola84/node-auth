'use strict';

const MVA = require('@scola/mva');

class StoreAction extends MVA.Action.Abstract {
  constructor(model) {
    super();
    this.model = model;
  }

  process(data) {
    this.model
      .setLoading(false)
      .setToken(data.token)
      .commit();
  }
}

module.exports = StoreAction;
