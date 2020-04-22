import React, { useReducer, useRef, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { Form, Input, Button, Message, Header } from 'semantic-ui-react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { firebaseConnect } from 'react-redux-firebase';

import store from '../store';
import { openModalWindow } from '../actions/ActionCreators';
import SignupForm from './SignupForm';
import ForgotPasswordForm from './ForgotPasswordForm';

const LoginForm = ({ firebase }) => {
  const initialState = {
    isLoading: false,
    isPristine: true,
    userEmail: '',
    userPassword: '',
    errorCode: '',
  };

  const reducer = (state, action) => {
    switch (action.type) {
      case 'initialize_login': {
        return {
          ...state,
          isLoading: true,
        };
      }
      case 'finalize_login': {
        return {
          ...state,
          isLoading: false,
          errorCode: '',
        };
      }
      case 'login_error': {
        return {
          ...state,
          isLoading: false,
          errorCode: action.payload,
          isPristine: true,
        };
      }
      case 'input_change': {
        const { inputName, inputValue } = action.payload;
        return {
          ...state,
          [inputName]: inputValue,
          isPristine: false,
        };
      }
      default: {
        return state;
      }
    }
  };

  const [state, dispatch] = useReducer(reducer, initialState);

  const emailRef = useRef(null);

  useEffect(() => {
    focusEmailInput();
  }, []);

  const errorCodes = {
    'auth/invalid-email': 'Invalid email address, please try again.',
    'auth/user-disabled':
      'Your account has been disabled. Please contact support for more information.',
    'auth/user-not-found':
      'We could not find an account for this user, please try again.',
    'auth/wrong-password': 'Invalid password, please try again.',
    'auth/popup-closed-by-user':
      'Login failed. Please try again and do not close the popup until fully logged in.',
  };

  const loginWithGoogle = () => {
    dispatch({
      type: 'initialize_login',
    });

    firebase
      .login({ provider: 'google', type: 'popup' })
      .then((user) => {
        afterLogin(user);

        dispatch({
          type: 'finalize_login',
        });
      })
      .catch((error) => {
        dispatch({
          type: 'login_error',
          payload: error.code,
        });
      });
  };

  const loginWithEmail = ({ userEmail, userPassword }) => {
    dispatch({
      type: 'initialize_login',
    });

    firebase
      .auth()
      .signInWithEmailAndPassword(userEmail, userPassword)
      .then((user) => {
        afterLogin(user);

        dispatch({
          type: 'finalize_login',
        });
      })
      .catch((error) => {
        focusEmailInput();

        dispatch({
          type: 'login_error',
          payload: error.code,
        });
      });
  };

  const afterLogin = () => {
    // dispatch pending action if login form popped up on user action
    const { actionPending } = store.getState().openModal;
    if (actionPending) {
      store.dispatch(store.getState().openModal.actionPending);
    }

    // close modal window
    store.dispatch(
      openModalWindow({
        open: false,
      }),
    );
  };

  const focusEmailInput = () => {
    emailRef.current.focus();
    ReactDOM.findDOMNode(emailRef.current)
      .querySelector('input')
      .select();
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

  const handleFormSubmit = (evt) => {
    evt.preventDefault();
    const { userEmail, userPassword } = state;

    loginWithEmail({
      userEmail,
      userPassword,
    });
  };

  const handleSignupClick = () => {
    store.dispatch(
      openModalWindow({
        open: true,
        title: 'Sign Up',
        body: <SignupForm />,
        headerIcon: 'signup',
      }),
    );
  };

  const handleForgotPasswordLink = () => {
    store.dispatch(
      openModalWindow({
        open: true,
        title: 'Reset Password',
        body: <ForgotPasswordForm />,
        headerIcon: 'repeat',
      }),
    );
  };

  const { errorCode, isLoading, isPristine } = state;

  const socialBarStyle = {
    paddingTop: '8px',
  };

  return (
    <React.Fragment>
      <Form onSubmit={handleFormSubmit} loading={isLoading}>
        <Header as='h2'>
          Welcome Back
          <Header.Subheader>Please sign in with your account.</Header.Subheader>
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
            placeholder='Enter your password'
            onChange={(evt) => handleInputChange('userPassword', evt)}
          />
        </Form.Field>
        <Form.Field>
          <button
            type='button'
            className='ButtonLink'
            onClick={handleForgotPasswordLink}
          >
            Forgot password?
          </button>
        </Form.Field>
        <Form.Field className='form-field-centered'>
          <Button type='submit' className='red-cta'>
            Login
          </Button>
          <Button type='button' basic onClick={handleSignupClick}>
            Sign Up
          </Button>
        </Form.Field>
        <Message className='social-row'>
          <Message.Header>Sign in with:</Message.Header>
          <Message.Content style={socialBarStyle}>
            <Button
              type='button'
              circular
              color='google plus'
              icon='google'
              onClick={loginWithGoogle}
            />
            <Button
              type='button'
              disabled
              circular
              color='facebook'
              icon='facebook'
            />
            <Button
              type='button'
              disabled
              circular
              color='twitter'
              icon='twitter'
            />
            <Button
              type='button'
              disabled
              circular
              color='linkedin'
              icon='github alternate'
            />
          </Message.Content>
        </Message>
        {errorCode && errorCode.length > 0 && isPristine ? (
          <Form.Field className='form-field-centered'>
            <Message negative>
              {(errorCode && errorCodes[errorCode]) || errorCode}
            </Message>
          </Form.Field>
        ) : null}
      </Form>
    </React.Fragment>
  );
};

export default compose(
  firebaseConnect(),
  connect(({ firebaseState: { auth } }) => ({ auth })),
)(LoginForm);
