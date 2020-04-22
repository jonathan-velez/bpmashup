import React, { useEffect, useReducer, useRef } from 'react';
import { Form, Input, Button, Message, Header } from 'semantic-ui-react';
import { compose, bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { firebaseConnect } from 'react-redux-firebase';

import { openModalWindow } from '../actions/ActionCreators';
import LoginForm from './LoginForm';

const SignupForm = ({ firebase, openModalWindow }) => {
  const initialState = {
    isLoading: false,
    isPristine: true,
    userEmail: '',
    userPassword: '',
    userPasswordConfirm: '',
    errorCode: '',
  };

  const reducer = (state, action) => {
    switch (action.type) {
      case 'input_change': {
        const { inputName, inputValue } = action.payload;
        return {
          ...state,
          [inputName]: inputValue,
          isPristine: false,
        };
      }
      case 'form_error': {
        const { errorCode, isPristine } = action.payload;
        return {
          ...state,
          errorCode,
          isPristine,
        };
      }
      case 'initialize_call': {
        return {
          ...state,
          isLoading: true,
          errorCode: '',
        };
      }
      case 'signup_successful': {
        return {
          ...state,
          isLoading: false,
          errorCode: '',
        };
      }
      case 'signup_unsuccessful': {
        const { errorCode } = action.payload;
        return {
          ...state,
          errorCode,
          isLoading: false,
          isPristine: true,
        };
      }
      default:
        throw new Error();
    }
  };

  const [state, dispatch] = useReducer(reducer, initialState);

  const errorCodes = {
    'passwords-mismatched':
      "The passwords you enetered don't match. Please try again.",
    'auth/weak-password':
      'The password you entered is too weak. Strengthen that shit!',
    'auth/email-already-in-use':
      'The email address you entered is already registered. Sign in with your password, or reset it if you have forgotten it.',
    'auth/invalid-email':
      'The email address you entered is invalid. Please try again.',
    'auth/operation-not-allowed':
      'Sign ups have been disabled. Please contact support for more information',
  };

  const emailRef = useRef(null);

  useEffect(() => {
    focusEmailInput();
  }, []);

  const focusEmailInput = () => {
    emailRef.current.focus();
  };

  const handleInputChange = (inputName, evt) => {
    dispatch({
      type: 'input_change',
      payload: {
        inputName: [inputName],
        inputValue: evt.target.value,
      },
    });
  };

  const validatePasswordsMatch = (userPassword, userPasswordConfirm) => {
    return userPassword === userPasswordConfirm;
  };

  const handleFormError = (errorCode) => {
    dispatch({
      type: 'form_error',
      payload: {
        errorCode,
        isPristine: true,
      },
    });
  };

  const intializeCall = () => {
    dispatch({
      type: 'initialize_call',
    });
  };

  const handleUnsuccesfulSignup = (errorCode) => {
    dispatch({
      type: 'signup_unsuccessful',
      payload: {
        errorCode,
      },
    });
  };

  const handleFormSubmit = async (evt) => {
    evt.preventDefault();

    const { userEmail, userPassword, userPasswordConfirm } = state;
    if (!validatePasswordsMatch(userPassword, userPasswordConfirm)) {
      return handleFormError('passwords-mismatched');
    }

    intializeCall();
    try {
      await firebase
        .auth()
        .createUserWithEmailAndPassword(userEmail, userPassword);
      handleSuccessfulSignup();
    } catch (error) {
      focusEmailInput();
      handleUnsuccesfulSignup(error.code);
    }
  };

  const handleLoginClick = () => {
    openModalWindow({
      open: true,
      title: 'Login',
      body: <LoginForm />,
      headerIcon: 'sign in',
    });
  };

  const handleSuccessfulSignup = () => {
    dispatch({
      type: 'signup_successful',
    });

    openModalWindow({
      open: false,
    });
  };

  const { errorCode, isLoading, isPristine } = state;

  return (
    <React.Fragment>
      <Form onSubmit={handleFormSubmit} loading={isLoading}>
        <Header as='h2'>
          Welcome to BPMashup
          <Header.Subheader>
            Please sign up with your email and choose a password.
          </Header.Subheader>
        </Header>
        <Form.Field>
          <label>Email</label>
          <Input
            type='email'
            placeholder='Enter your email address'
            ref={emailRef}
            onChange={(evt) => handleInputChange('userEmail', evt)}
          />
        </Form.Field>
        <Form.Field>
          <label>Password</label>
          <Input
            type='password'
            autoComplete='new-password'
            placeholder='Enter your password'
            onChange={(evt) => handleInputChange('userPassword', evt)}
          />
        </Form.Field>
        <Form.Field>
          <label>Confirm Password</label>
          <Input
            type='password'
            autoComplete='new-password'
            placeholder='Confirm your password'
            onChange={(evt) => handleInputChange('userPasswordConfirm', evt)}
          />
        </Form.Field>
        <Form.Field className='form-field-centered'>
          <Button type='submit' className='red-cta'>
            Sign Up
          </Button>
          <Button type='button' basic onClick={handleLoginClick}>
            Already have an account?
          </Button>
        </Form.Field>
        {errorCode.length > 0 && isPristine && (
          <Form.Field className='form-field-centered'>
            <Message negative>
              {(errorCode && errorCodes[errorCode]) || errorCode}
            </Message>
          </Form.Field>
        )}
      </Form>
    </React.Fragment>
  );
};

// TODO: Figure out why the shorthand of this fn doesn't work with connect below
const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({ openModalWindow }, dispatch);
};

export default compose(
  firebaseConnect(),
  connect(
    ({ firebaseState: { auth } }) => ({ auth }),
    mapDispatchToProps,
  ),
)(SignupForm);
