'use strict';

const MVA = require('@scola/mva');

class SigninPasswordView extends MVA.View.Abstract {
  constructor(model) {
    super();
    this.model = model;
    this.isLoading = false;
  }

  build() {
    this
      .view('form', '@scola.form.form')
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
      .style({
        height: '2em'
      })
      .element('input')
      .properties({
        type: 'text',
        name: 'username',
        placeholder: 'Gebruikersnaam'
      })
      .style({
        padding: '0 0.33em'
      });

    this
      .view('password', '@scola.form.input')
      .element('wrapper')
      .style('@scola.absmax')
      .style({
        height: '2em',
        right: '2.5em',
        top: '2.5em'
      })
      .element('input')
      .properties({
        type: 'password',
        name: 'password',
        placeholder: 'Wachtwoord'
      })
      .style({
        padding: '0 0.33em'
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
        top: '2.5em'
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
        top: '5em'
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

    this.bindListener('error', this.model, this.handleModelError);

    return this;
  }

  render() {
    return this.view('form').render();
  }

  destroy() {
    this.unbindListener('error', this.model, this.handleModelError);
    super.destroy();
  }

  // flip does not work first time

  handleModelError(event) {
    this.isLoading = false;
    this.changeButton();

    if (event.data.username instanceof Error) {
      return this
        .view('username')
        .showBubble('Dit veld is verplicht.', 'bottom')
        .element('input')
        .get()
        .focus();
    }

    if (event.data.password instanceof Error) {
       return this
        .view('password')
        .showBubble('Dit veld is verplicht.', 'bottom')
        .element('input')
        .get()
        .focus();
    }
  }

  handleEnable(event) {
    event.view
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
    event.view
      .element('checkbox')
      .properties({
        className: event.checked ? 'ion ion-checkmark' : ''
      });
  }

  handleSubmit(event) {
    event.preventDefault();

    if (this.isLoading) {
      return;
    }

    this.isLoading = true;
    this.changeButton();

    this.model
      .setPermanent(this.view('checkbox').isChecked())
      .setUsername(this.view('username').element('input').get().value)
      .setPassword(this.view('password').element('input').get().value);

    if (this.model.commit('signin-password-begin')) {
      this.model.signinPassword();
    }
  }

  changeButton() {
    this
      .view('button')
      .enable(!this.isLoading);
  }
}

module.exports = SigninPasswordView;
