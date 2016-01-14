'use strict';

const MVA = require('@scola/mva');

class SigninPasswordView extends MVA.View.Abstract {
  constructor(model, i18n) {
    super();

    this.model = model;
    this.i18n = i18n;
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
        name: 'username',
        placeholder: 'Gebruikersnaam'
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
        name: 'password',
        placeholder: 'Wachtwoord'
      });

    this
      .view('button', '@scola.form.button-icon')
      .element('button')
      .properties({
        type: 'submit',
        title: 'Inloggen'
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
      }, this)
      .element('label')
      .properties({
        innerHTML: 'Laat mij ingelogd blijven'
      });

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

    this.bindListener('change', this.model, this.handleModelChange);
    this.bindListener('error', this.model, this.handleModelError);

    return this;
  }

  render() {
    return this.view('form').render();
  }

  destroy() {
    this.unbindListener('change', this.model, this.handleModelChange);
    this.unbindListener('error', this.model, this.handleModelError);
    super.destroy();
  }

  handleModelChange(event) {
    // console.log('change', event);
  }

  handleModelError(event) {
    this.changeButton();

    if (event.error.message === '@scola.auth.invalid-data') {
      return this.handleDataError(event);
    }

    this.handleError(event);
  }

  handleError(event) {
    this.popup = this
      .view('popups')
      .view('popup', '@scola.popup');

    this
      .popup
      .element('title')
      .properties({
        innerHTML: 'Error'
      })
      .element('text')
      .properties({
        innerHTML: this.i18n.get('string').format(event.error.message)
      });

    this
      .popup
      .view('button-ok', '@scola.popup.button')
      .element('button')
      .properties({
        innerHTML: 'OK'
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

  handleDataError(event) {
    this.model.setIdle();

    let viewName = null;

    if (event.data.username instanceof Error) {
      viewName = 'username';
    } else if (event.data.password instanceof Error) {
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
          innerHTML: 'Dit veld is verplicht'
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
      .setPermanent(this.view('checkbox').element('input').get().checked)
      .setUsername(this.view('username').element('input').get().value)
      .setPassword(this.view('password').element('input').get().value);

    this.changeButton();

    if (this.model.commit('signin-password-begin')) {
      this.model.signinPassword();
    }
  }

  changeButton() {
    this
      .view('button')
      .enable(!this.model.isBusy());
  }
}

module.exports = SigninPasswordView;
