'use strict';

const MVA = require('@scola/mva');

class AuthorizeView extends MVA.View.Abstract {
  constructor(model, actionDispatcher) {
    super();

    this.model = model;
    this.actionDispatcher = actionDispatcher;
  }

  build() {
    this
      .view('form', '@scola.form.form')
      .element('form')
      .props({
        method: 'POST'
      })
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
      .style('absmax')
      .style({
        height: '2em'
      })
      .element('input')
      .props({
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
      .style('absmax')
      .style({
        height: '2em',
        right: '2.5em',
        top: '2.5em'
      })
      .element('input')
      .props({
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
      .props({
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
      .props({
        className: 'ion ion-android-arrow-forward'
      });

    this
      .view('checkbox', '@scola.form.checkbox-label')
      .element('wrapper')
      .style('absmax')
      .style({
        height: '1.5em',
        top: '5em'
      })
      .element('checkbox')
      .listen({
        'check': this.handleCheck
      }, this)
      .element('label')
      .props({
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

    this.bindListener('change', this.model, this.handleModelChange);

    return this;
  }

  render() {
    return this.view('form').render();
  }

  destroy() {
    this.unbindListener('change', this.model, this.handleModelChange);
    super.destroy();
  }

  handleModelChange(event) {
    this.changeButton();

    console.log(event);

    if (event.error) {
      alert(JSON.stringify(event.error));
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
    } else if (!event.enabled && !this.hasView('spinner')) {
      this
        .view('spinner', '@scola.widget.spinner');

      this
        .view('button')
        .element('button')
        .append(
          this.view('spinner').render()
        );
    }
  }

  handleCheck(event) {
    this.model.setPermanent(event.checked);

    event.view
      .element('checkbox')
      .props({
        className: event.checked ? 'ion ion-checkmark' : ''
      });
  }

  handleSubmit(event) {
    event.preventDefault();

    if (this.model.isLoading()) {
      return;
    }

    this.actionDispatcher
      .get('@scola.auth.password.authorize')
      .execute({
        username: this.view('username').element('input').get().value,
        password: this.view('password').element('input').get().value
      });
  }

  changeButton() {
    this
      .view('button')
      .setEnabled(!this.model.isLoading());
  }
}

module.exports = AuthorizeView;
