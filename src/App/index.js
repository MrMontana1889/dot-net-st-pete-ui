import React, { Component } from 'react';
import { hashHistory } from 'react-router';
import { show } from 'js-snackbar';
const { remote, ipcRenderer } = window.require('electron');
import endpoints from '../constants/endpoints';
import { post } from '../utility/fetch.utility';
import Login from '../Login';
import Loading from '../Loading';

class App extends Component {
  constructor(props) {
    super(props);

    this.handleFieldChange = this.handleFieldChange.bind(this);
    this.handleLogin = this.handleLogin.bind(this);
    this.setStateField = this.setStateField.bind(this);

    this.state = {
      email: '',
      password: '',
      loadingActive: false
    };
  }

  componentDidMount() {
    // eslint-disable-next-line
    componentHandler.upgradeDom();
  }

  componentWillMount() {
    // todo: validate user is logged
  }

  handleLogin() {
    let { email, password } = this.state;

    if (!email || !password) {
      remote.dialog.showMessageBox(null, {
        type: 'warning',
        message: 'Email and Password are required'
      });
      show({ text: 'Email and Password are required', backgroundColor: '#FF9800', pos: 'bottom-right' });
    } else {
      this.login(email, password);
    }
  }

  handleFieldChange(field, event) {
    this.setStateField(field, event.target.value);
  }

  login(email, password) {
    this.setState({ loadingActive: true }, () => {
      post(endpoints.USER.login, { email, password })
        .then(response => {
          this.setState({ loadingActive: false }, () => {
            ipcRenderer.send('login-successful', response.access_token);
            hashHistory.push('/beerJournal');
          });
        })
        .catch(error => {
          this.setState({ loadingActive: false });
          console.log(error);
          show({ text: 'Login failed', backgroundColor: '#F44336', pos: 'bottom-right' });
        });
    });
  }

  setStateField(field, value) {
    let new_state = { ...this.state };
    new_state[field] = value;
    this.setState(new_state);
  }

  render() {
    let { loadingActive, email, password } = this.state;

    return (
      <div>
        <Loading active={loadingActive}/>

        <Login email={email}
               password={password}
               handleFieldChange={this.handleFieldChange}
               handleLogin={this.handleLogin}/>
      </div>
    );
  }
}

export default App;
