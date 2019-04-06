import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Form, Input, Button, Message, Header } from 'semantic-ui-react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { firebaseConnect } from 'react-redux-firebase';

import store from '../store';
import { loadPlaylists } from '../thunks/';
import { openModalWindow } from '../actions/ActionCreators';
import LoginForm from './LoginForm';

class SignupForm extends Component {
  state = {
    isLoading: false,
    isPristine: true,
    userEmail: '',
    userPassword: '',
    userPasswordConfirm: '',
    errorCode: '',
  }

  errorCodes = {
    'passwords-mismatched': 'The passwords you enetered don\'t match. Please try again.',
    'auth/weak-password': 'The password you entered is too weak. Strengthen that shit!',
    'auth/email-already-in-use': 'The email address you entered is already registered. Sign in with your password, or reset it if you have forgotten it.',
    'auth/invalid-email': 'The email address you entered is invalid. Please try again.',
    'auth/operation-not-allowed': 'Sign ups have been disabled. Please contact support for more information',
  }

  componentDidMount() {
    this.focus();
  }

  setEmailRef = (input) => {
    this.inputEmailRef = input;
  }

  focus = () => {
    this.inputEmailRef.focus();
    ReactDOM.findDOMNode(this.inputEmailRef).querySelector('input').select();
  }

  handleInputChange = (inputName, evt) => {
    this.setState({
      [inputName]: evt.target.value,
      isPristine: false,
    })
  }

  handleFormSubmit = (evt) => {
    evt.preventDefault();

    const { userEmail, userPassword, userPasswordConfirm } = this.state;
    if (userPassword !== userPasswordConfirm) {
      this.setState({ errorCode: 'passwords-mismatched', isPristine: true });
      return;
    }

    this.setState({ isLoading: true });

    this.props.firebase.auth().createUserWithEmailAndPassword(userEmail, userPassword)
      .then(user => {
        this.afterLogin(user);
        this.setState({ isLoading: false, errorCode: '' });
      })
      .catch((error) => {
        this.focus();
        this.setState({ isLoading: false, errorCode: error.code, isPristine: true });
      });
  }

  handleLoginClick = () => {
    store.dispatch(openModalWindow({
      open: true,
      title: 'Login',
      body: <LoginForm />,
      headerIcon: 'sign in',
    }));
  }

  afterLogin = () => {
    store.dispatch(openModalWindow({
      open: false,
    }));

    store.dispatch(loadPlaylists());
  }

  render() {
    const { errorCode, isLoading, isPristine } = this.state;

    return (
      <React.Fragment>
        <Form onSubmit={this.handleFormSubmit} loading={isLoading}>
          <Header as='h2'>
            Welcome to BPMashup
            <Header.Subheader>Please sign up with your email and choose a password.</Header.Subheader>
          </Header>
          <Form.Field>
            <label>Email</label>
            <Input type="email" placeholder='Enter your email address' ref={this.setEmailRef} onChange={(evt) => this.handleInputChange('userEmail', evt)} />
          </Form.Field>
          <Form.Field>
            <label>Password</label>
            <Input type="password" placeholder='Enter your password' onChange={(evt) => this.handleInputChange('userPassword', evt)} />
          </Form.Field>
          <Form.Field>
            <label>Confirm Password</label>
            <Input type="password" placeholder='Confirm your password' onChange={(evt) => this.handleInputChange('userPasswordConfirm', evt)} />
          </Form.Field>
          <Form.Field className='form-field-centered'>
            <Button type='submit' className='red-cta'>Sign Up</Button>
            <Button type='button' basic onClick={this.handleLoginClick}>Already have an account?</Button>
          </Form.Field>
          {errorCode.length > 0 && isPristine ?
            <Form.Field className='form-field-centered'>
              <Message negative>{(errorCode && this.errorCodes[errorCode]) || errorCode}</Message>
            </Form.Field>
            : null}
        </Form>
      </React.Fragment>
    );
  }
}

export default compose(
  firebaseConnect(),
  connect(({ firebaseState: { auth } }) => ({ auth }))
)(SignupForm);
