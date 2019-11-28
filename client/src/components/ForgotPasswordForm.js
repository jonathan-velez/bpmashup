import React, { useReducer, useEffect, useRef } from 'react';
import { Form, Input, Button, Message, Header } from 'semantic-ui-react';
import { compose, bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { firebaseConnect } from 'react-redux-firebase';

import { openModalWindow } from '../actions/ActionCreators';
import LoginForm from './LoginForm';

const ForgotPasswordForm = ({ firebase, openModalWindow }) => {
  const initialState = {
    isLoading: false,
    isPristine: true,
    userEmail: '',
    errorCode: '',
  }

  const reducer = (state, action) => {
    switch (action.type) {
      case 'input_change': {
        const { inputName, inputValue } = action.payload;
        return {
          ...state,
          [inputName]: inputValue,
          isPristine: false,
        }
      }
      case 'form_error': {
        const { errorCode, isPristine } = action.payload;
        return {
          ...state,
          errorCode,
          isPristine,
        }
      }
      case 'initialize_call': {
        return {
          ...state,
          isLoading: true,
          errorCode: '',
        }
      }
      case 'reset_successful': {
        return {
          ...state,
          isLoading: false,
          errorCode: '',
        }
      }
      case 'reset_unsuccessful': {
        const { errorCode } = action.payload;
        return {
          ...state,
          errorCode,
          isLoading: false,
          isPristine: true,
        }
      }
      default: {
        return state;
      }
    }
  }

  const errorCodes = {
    'auth/user-not-found': 'No registered user with that email address.',
    'auth/invalid-email': 'The email address you entered is invalid. Please try again.',
  };

  const [state, dispatch] = useReducer(reducer, initialState);
  const emailRef = useRef(null);

  useEffect(() => {
    focusEmailInput();
  }, []);

  const focusEmailInput = () => {
    emailRef.current.focus();
    emailRef.current.select();
  }

  const handleInputChange = (inputName, evt) => {
    dispatch({
      type: 'input_change',
      payload: {
        inputName: [inputName],
        inputValue: evt.target.value,
      }
    });
  }

  const intializeCall = () => {
    dispatch({
      type: 'initialize_call',
    });
  }

  const handleFormSubmit = async (evt) => {
    evt.preventDefault();
    const { userEmail } = state;

    intializeCall();


    try {
      await firebase.auth().sendPasswordResetEmail(userEmail);
      handleSuccessfulPasswordReset();
    } catch (error) {
      focusEmailInput();
      handleUnsuccesfulPasswordReset(error.code);
    }
  }

  const handleSuccessfulPasswordReset = () => {
    dispatch({
      type: 'reset_successful',
    });

    openModalWindow({
      open: true,
      title: 'Check your email',
      body: <Message positive>The reset link has been emailed.</Message>,
      headerIcon: 'mail',
    });
  }

  const handleUnsuccesfulPasswordReset = (errorCode) => {
    dispatch({
      type: 'reset_unsuccessful',
      payload: {
        errorCode,
      }
    });

    focusEmailInput();
  }

  const handleLoginClick = () => {
    openModalWindow({
      open: true,
      title: 'Login',
      body: <LoginForm />,
      headerIcon: 'sign in',
    });
  }

  const { errorCode, isLoading, isPristine } = state;

  return (
    <React.Fragment>
      <Form onSubmit={handleFormSubmit} loading={isLoading}>
        <Header as='h2'>
          Forgot Your Password?
            <Header.Subheader>Enter your email address and we'll send you a reset password link.</Header.Subheader>
        </Header>
        <Form.Field>
          <label>Email</label>
          <Input type="email" placeholder='Enter your email address' ref={emailRef} onChange={(evt) => handleInputChange('userEmail', evt)} />
        </Form.Field>
        <Form.Field>
          <button type='button' className='ButtonLink' onClick={handleLoginClick}>Just kidding, I know my password.</button>
        </Form.Field>
        <Form.Field className='form-field-centered'>
          <Button type='submit' className='red-cta'>Reset Password</Button>
        </Form.Field>
        {errorCode.length > 0 && isPristine ?
          <Form.Field className='form-field-centered'>
            <Message negative>{(errorCode && errorCodes[errorCode]) || errorCode}</Message>
          </Form.Field>
          : null}
      </Form>
    </React.Fragment>
  );

}

// TODO: Figure out why the shorthand of this fn doesn't work with connect below
const mapDispatchToProps = dispatch => {
  return bindActionCreators({ openModalWindow }, dispatch);
}

export default compose(
  firebaseConnect(),
  connect(
    ({ firebaseState: { auth } }) => ({ auth }),
    mapDispatchToProps,
  )
)(ForgotPasswordForm);
