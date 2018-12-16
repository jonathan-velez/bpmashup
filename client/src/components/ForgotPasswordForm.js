import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Form, Input, Button, Message, Header } from 'semantic-ui-react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { firebaseConnect } from 'react-redux-firebase';

import store from '../store';
import { openModalWindow } from '../actions/ActionCreators';
import LoginForm from './LoginForm';

class ForgotPasswordForm extends Component {
  state = {
    isLoading: false,
    isPristine: true,
    userEmail: '',
    errorCode: '',
  }

  errorCodes = {
    'auth/user-not-found': 'No registered user with that email address.',
    'auth/invalid-email': 'The email address you entered is invalid. Please try again.',
  };

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
    const { userEmail } = this.state;

    this.setState({ isLoading: true });

    this.props.firebase.auth().sendPasswordResetEmail(userEmail).then(() => {
      this.setState({ isLoading: false, errorCode: '' });
      this.afterReset();
    }).catch(error => {
      this.focus();
      this.setState({ isLoading: false, errorCode: error.code, isPristine: true });
    });
  }

  afterReset = () => {
    store.dispatch(openModalWindow({
      open: true,
      title: 'Check your email',
      body: <Message positive>The reset link has been emailed.</Message>,
      headerIcon: 'mail',
    }));
  }

  handleLoginClick = () => {
    store.dispatch(openModalWindow({
      open: true,
      title: 'Login',
      body: <LoginForm />,
      headerIcon: 'sign in',
    }));
  }

  render() {
    const { errorCode, isLoading, isPristine } = this.state;

    return (
      <React.Fragment>
        <Form onSubmit={this.handleFormSubmit} loading={isLoading}>
          <Header as='h2'>
            Forgot Your Password?
            <Header.Subheader>Enter your email address and we'll send you a reset password link.</Header.Subheader>
          </Header>
          <Form.Field>
            <label>Email</label>
            <Input type="email" placeholder='Enter your email address' ref={this.setEmailRef} onChange={(evt) => this.handleInputChange('userEmail', evt)} />
          </Form.Field>
          <Form.Field>
            <a href="#" onClick={this.handleLoginClick}>Just kidding, I know my password.</a>
          </Form.Field>
          <Form.Field className='form-field-centered'>
            <Button type='submit' className='red-cta'>Reset Password</Button>
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
)(ForgotPasswordForm);
