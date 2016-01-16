'use strict';

const MVA = require('@scola/mva');

class SigninPasswordView extends MVA.View.Abstract {
  constructor(model, i18n) {
    super();

    this.model = model;
    this.i18n = i18n;
    this.string = i18n.get('string');
    this.popup = null;
  }

  build() {
    this
      .view('form', '@scola.form')
      .element('form')
      .style({
        background: '#EEE',
        position: 'absolute',
        width: '23.75em',
        height: '8.5em'
      })
      .listen({
        'submit': this.handleSubmit
      }, this)
      .element('fieldset')
      .style({
        bottom: '1em',
        left: '1em',
        right: '1em',
        top: '1em'
      });

    this
      .view('username', '@scola.form.input')
      .element('wrapper')
      .style('@scola.absmax')
      .element('input')
      .properties({
        type: 'text',
        name: 'username'
      });

    this
      .view('password', '@scola.form.input')
      .element('wrapper')
      .style('@scola.absmax')
      .style({
        right: '3em',
        top: '3em'
      })
      .element('input')
      .properties({
        type: 'password',
        name: 'password'
      });

    this
      .view('button', '@scola.form.button-icon')
      .element('button')
      .properties({
        type: 'submit'
      })
      .style({
        position: 'absolute',
        right: 0,
        top: '3em'
      })
      .listen({
        'enable': this.handleEnable
      }, this)
      .element('icon')
      .properties({
        className: 'ion ion-android-arrow-forward'
      });

    this
      .view('checkbox', '@scola.form.checkbox-label')
      .element('wrapper')
      .style('@scola.absmax')
      .style({
        height: '1.5em',
        top: '6em'
      })
      .element('checkbox')
      .listen({
        'check': this.handleCheck
      }, this);

    this
      .view('form')
      .element('fieldset')
      .append(
        this.view('username').render()
      )
      .append(
        this.view('password').render()
      )
      .append(
        this.view('button').render()
      )
      .append(
        this.view('checkbox').render()
      );

    this.view('popups', '@scola.popup.container');

    this.bindListeners();
    this.handleLanguageChange();

    return this;
  }

  render() {
    return this.view('form').render();
  }

  destroy() {
    this.unbindListeners();
    super.destroy();
  }

  bindListeners() {
    this.bindListener('language', this.i18n, this.handleLanguageChange);
    this.bindListener('change', this.model, this.handleModelChange);
    this.bindListener('error', this.model, this.handleModelError);
  }

  unbindListeners() {
    this.unbindListener('language', this.i18n, this.handleLanguageChange);
    this.unbindListener('change', this.model, this.handleModelChange);
    this.unbindListener('error', this.model, this.handleModelError);
  }

  handleSubmit(event) {
    event.preventDefault();

    if (this.bubble) {
      this.bubble.destroy(true);
    }

    if (!this.model.isIdle()) {
      return;
    }

    this
      .model
      .setBusy()
      .setPermanent(this.view('checkbox').checked())
      .setUsername(this.view('username').value())
      .setPassword(this.view('password').value());

    this.changeButton();

    if (this.model.commit('signin-password-begin')) {
      this.model.signinPassword();
    }
  }

  handleEnable(event) {
    event
      .view
      .element('icon')
      .style({
        display: event.enabled ? '' : 'none'
      });

    if (event.enabled && this.hasView('spinner')) {
      this
        .removeView('spinner')
        .destroy();

      this
        .view('button')
        .element('button')
        .properties({
          title: 'Inloggen'
        })
        .style({
          cursor: 'pointer'
        });
    } else if (!event.enabled && !this.hasView('spinner')) {
      this
        .view('spinner', '@scola.widget.spinner');

      this
        .view('button')
        .element('button')
        .properties({
          title: 'Laden...'
        })
        .style({
          cursor: 'default'
        })
        .append(
          this.view('spinner').render()
        );
    }
  }

  handleCheck(event) {
    event
      .view
      .element('checkbox')
      .properties({
        className: event.checked ? 'ion ion-checkmark' : ''
      });
  }

  handleLanguageChange() {
    this
      .view('username')
      .element('input')
      .properties({
        placeholder: this.string.format('@scola.auth.input.username')
      });

    this
      .view('password')
      .element('input')
      .properties({
        placeholder: this.string.format('@scola.auth.input.password')
      });

    this
      .view('button')
      .element('button')
      .properties({
        title: this.string.format('@scola.auth.input.sign-in')
      });

    this
      .view('checkbox')
      .element('label')
      .properties({
        innerHTML: this.string.format('@scola.auth.input.keep-signed-in')
      });
  }

  handleModelChange(event) {
    if (event.name === 'signin-password-end') {
      this.changeButton();
    }
  }

  handleModelError(event) {
    this.changeButton();

    if (event.error.message === '@scola.mva.error.commit') {
      return this.handleCommitError(event);
    }

    this.handleError(event);
  }

  handleCommitError(event) {
    this.model.setIdle();

    let error = null;
    let viewName = null;

    if (event.data.username instanceof Error) {
      error = event.data.username.message.split(' ');
      viewName = 'username';
    } else if (event.data.password instanceof Error) {
      error = event.data.password.message.split(' ');
      viewName = 'password';
    }

    if (viewName) {
      this.bubble = this
        .view(viewName)
        .view('bubble', '@scola.widget.tooltip');

      this
        .bubble
        .element('wrapper')
        .listen({
          destroy: () => {
            this.view(viewName).removeView('bubble');
          }
        })
        .element('text')
        .properties({
          innerHTML: this.string.format(...error)
        });

      this
        .view(viewName)
        .element('wrapper')
        .append(
          this.bubble.render()
        )
        .element('input')
        .get()
        .focus();

      this
        .bubble
        .bottom();
    }
  }

  handleError(event) {
    this.popup = this
      .view('popups')
      .view('popup', '@scola.popup');

    this
      .popup
      .element('title')
      .properties({
        innerHTML: this.string.format('@scola.mva.generic.error')
      })
      .element('text')
      .properties({
        innerHTML: this.string.format(event.error.message)
      });

    this
      .popup
      .view('button-ok', '@scola.popup.button')
      .element('button')
      .properties({
        innerHTML: this.string.format('@scola.mva.generic.ok')
      })
      .style({
        borderLeft: '1px solid #CCC',
        fontWeight: 'bold',
        width: '100%'
      })
      .listen({
        click: () => {
          this
            .view('popups')
            .removeView('popup')
            .destroy();
        }
      }, this);

    this
      .popup
      .element('wrapper')
      .listen({
        destroy: this.handleDestroyPopup
      }, this)
      .append(
        this.popup.view('button-ok').render()
      );

    this
      .view('popups')
      .element('container')
      .append(
        this.popup.render()
      );

    this
      .popup
      .center()
      .view('button-ok')
      .element('button')
      .get()
      .focus();
  }

  handleDestroyPopup() {
    this.model.setIdle();
    this.popup = null;
  }

  changeButton() {
    this
      .view('button')
      .enable(!this.model.isBusy());
  }
}

module.exports = SigninPasswordView;
