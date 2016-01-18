'use strict';

const DI = require('@scola/di');
const I18n = require('@scola/i18n');
const MVA = require('@scola/mva');
const Validator = require('@scola/validator');

class Module extends DI.Module {
  configure() {
    this.addModule(I18n.Module);

    this.inject(I18n.StringFormat)
      .updateArgument(0, this.object(MVA.I18n))
      .updateArgument(0, this.object(Validator.I18n))
      .updateArgument(0, this.object({
        nl_NL: require('./nl_NL.json')
      })
    );
  }
}

module.exports = {
  Module
};
