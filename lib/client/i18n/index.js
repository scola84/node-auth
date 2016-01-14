'use strict';

const DI = require('@scola/di');
const I18n = require('@scola/i18n');

class Module extends DI.Module {
  configure() {
    this.addModule(I18n.Module);

    this.inject(I18n.StringFormat)
      .assignArgument(0, this.object({
        nl_NL: require('./nl_NL.json')
      })
    );
  }
}

module.exports = {
  Module
};
