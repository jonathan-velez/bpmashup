import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Form, Input, Button, Message, Header } from 'semantic-ui-react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { firebaseConnect } from 'react-redux-firebase';

import store from '../store';
import { loadPlaylists } from '../thunks/';
import { openModalWindow } from '../actions/ActionCreators';
import SignupForm from './SignupForm';
import ForgotPasswordForm from './ForgotPasswordForm';

class LoginForm extends Component {
  state = {
    isLoading: false,
    isPristine: true,
    userEmail: '',
    userPassword: '',
    errorCode: '',
  }

  errorCodes = {
    'auth/invalid-email': 'Invalid email address, please try again.',
    'auth/user-disabled': 'Your account has been disabled. Please contact support for more information.',
    'auth/user-not-found': 'We could not find an account for this user, please try again.',
    'auth/wrong-password': 'Invalid password, please try again.',
    'auth/popup-closed-by-user': 'Login failed. Please try again and do not close the popup until fully logged in.',
  }

  loginWithGoogle = () => {
    this.setState({ isLoading: true });

    this.props.firebase.login({ provider: 'google', type: 'popup' }).then(user => {
      this.afterLogin(user);
      this.setState({ isLoading: false, errorCode: '' });
    })
      .catch((error) => {
        this.setState({ isLoading: false, errorCode: error.code, isPristine: true });
      });
  }

  loginWithEmail = ({ userEmail, userPassword }) => {
    this.setState({ isLoading: true });

    this.props.firebase.auth().signInWithEmailAndPassword(userEmail, userPassword)
      .then(user => {
        this.afterLogin(user);
        this.setState({ isLoading: false, errorCode: '' });
      })
      .catch((error) => {
        this.focus();
        this.setState({ isLoading: false, errorCode: error.code, isPristine: true });
      });
  }

  afterLogin = (user) => {
    console.log('after login', user); // TODO: store this in a User reducer
    store.dispatch(openModalWindow({
      open: false,
    }));

    store.dispatch(loadPlaylists());
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
    const { userEmail, userPassword } = this.state;

    this.loginWithEmail({
      userEmail,
      userPassword
    });
  }

  handleSignupClick = () => {
    store.dispatch(openModalWindow({
      open: true,
      title: 'Sign Up',
      body: <SignupForm />,
      headerIcon: 'signup',
    }));
  }

  handleForgotPasswordLink = () => {
    store.dispatch(openModalWindow({
      open: true,
      title: 'Reset Password',
      body: <ForgotPasswordForm />,
      headerIcon: 'repeat',
    }));
  }

  render() {
    const { errorCode, isLoading, isPristine } = this.state;

    const socialBarStyle = {
      paddingTop: '8px'
    }

    return (
      <React.Fragment>
        <Form onSubmit={this.handleFormSubmit} loading={isLoading}>
          <Header as='h2'>
            Welcome Back
            <Header.Subheader>Please sign in with your account.</Header.Subheader>
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
            <button type='button' className='ButtonLink' onClick={this.handleForgotPasswordLink}>Forgot password?</button>
          </Form.Field>
          <Form.Field className='form-field-centered'>
            <Button type='submit' className='red-cta'>Login</Button>
            <Button type='button' basic onClick={this.handleSignupClick}>Sign Up</Button>
          </Form.Field>
          <Message className='social-row'>
            <Message.Header>Sign in with:</Message.Header>
            <Message.Content style={socialBarStyle}>
              <Button circular color='google plus' icon='google' onClick={this.loginWithGoogle} />
              <Button disabled circular color='facebook' icon='facebook' />
              <Button disabled circular color='twitter' icon='twitter' />
              <Button disabled circular color='linkedin' icon='github alternate' />
            </Message.Content>
          </Message>
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
)(LoginForm);
