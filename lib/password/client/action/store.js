'use strict';

const MVA = require('@scola/mva');

class StoreAction extends MVA.Action.Abstract {
  constructor(model) {
    super();
    this.model = model;
  }

  process(data) {
    this.model.setLoading(false);

    if (data.error) {
      this.model.setError(data.error);
    } else {
      this.model.setToken(data.token);
    }

    this.model.commit();
  }
}

module.exports = StoreAction;
