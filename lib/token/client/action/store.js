'use strict';

const MVA = require('@scola/mva');

class StoreAction extends MVA.Action.Abstract {
  constructor(model) {
    super();
    this.model = model;
  }

  process(data) {
    if (data.error) {
      this.model.setError(data.error);
    } else {
      this.model.setUserId(data.userId);
    }

    this.model.commit();
  }
}

module.exports = StoreAction;
