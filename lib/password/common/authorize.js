'use strict';

const MVA = require('@scola/mva');

class AbstractAuthorizeAction extends MVA.Action.Abstract {
  constructor(validator) {
    super();
    this.validator = validator;
  }

  validate(data) {
    return this.validator.validate({
      username: {
        type: 'string',
        length: [1]
      },
      password: {
        type: 'string',
        length: [1]
      }
    }, data);
  }
}

module.exports = AbstractAuthorizeAction;
