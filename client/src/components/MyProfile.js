import React, { useReducer, useEffect } from 'react';
import { connect } from 'react-redux';
import firebase from 'firebase';
import { Grid, Form, Input, Button, Message, Dropdown, TextArea } from 'semantic-ui-react';

import PhotoUpload from './PhotoUpload';
import LoggedOutMessage from './LoggedOutMessage';
import { getUserId } from '../selectors';

const SET_INPUT_CHANGE = 'SET_INPUT_CHANGE';
const SET_FAVORITE_GENRES = 'SET_FAVORITE_GENRES';
const SET_INITIAL_FORM_VALUES = 'SET_INITIAL_FORM_VALUES';
const SET_FORM_MESSAGE = 'SET_FORM_MESSAGE';

const MyProfile = ({ uid, genreList }) => {
  const db = firebase.database();

  const initialState = {
    isPristine: true,
    formMessage: {
      isError: false,
      content: undefined,
    },
    userDetails: {
      firstName: '',
      lastName: '',
      biography: '',
      websiteURL: '',
      favoriteGenres: [],
    }
  }

  const reducer = (state, action) => {
    const { type, payload } = action;

    switch (type) {
      case SET_INPUT_CHANGE: {
        const { inputName, inputValue } = payload;

        return {
          ...state,
          isPristine: false,
          userDetails: {
            ...state.userDetails,
            [inputName]: inputValue,
          },
        }
      }
      case SET_FORM_MESSAGE: {
        return {
          ...state,
          isPristine: true,
          formMessage: {
            isError: payload.isError,
            content: payload.content,
          }
        }
      }
      case SET_FAVORITE_GENRES: {
        return {
          ...state,
          isPristine: payload.isInitial,
          userDetails: {
            ...state.userDetails,
            favoriteGenres: payload.genres,
          }
        }
      }
      case SET_INITIAL_FORM_VALUES: {
        return {
          ...state,
          isPristine: true,
          userDetails: {
            ...payload
          }
        }
      }
      default: {
        return state;
      }
    }
  }

  const [state, dispatch] = useReducer(reducer, initialState);
  const { userDetails, formMessage, isPristine } = state;

  useEffect(() => {
    const loadFb = async () => {
      if (!uid) return;

      const userRef = db.ref(`users/${uid}`);
      const userExtendedRef = db.ref(`usersExtended/${uid}`);

      let userExtendedDetails = {};
      let userDisplayName = '';

      await userExtendedRef.once('value', (snapshot) => {
        const { favoriteGenres, ...restOfUserDetails } = snapshot.val();
        const favoriteGenresArray = Object.keys(favoriteGenres);

        userExtendedDetails = {
          favoriteGenres: favoriteGenresArray,
          ...restOfUserDetails,
        }
      });

      await userRef.child('displayName').once('value', (snapshot) => {
        userDisplayName = snapshot.val();
      });

      const [firstName, lastName] = userDisplayName.split(' ');

      const fullUserDetails = {
        ...userExtendedDetails,
        firstName,
        lastName,
      }

      dispatch({
        type: SET_INITIAL_FORM_VALUES,
        payload: fullUserDetails,
      })
    }
    loadFb();
  }, [db, uid]);

  const handleInputChange = (evt) => {
    const { name: inputName, value: inputValue } = evt && evt.target;

    dispatch({
      type: SET_INPUT_CHANGE,
      payload: {
        inputName,
        inputValue,
      }
    });
  }

  const isFormValid = () => {
    const { firstName, lastName } = userDetails;
    return (!firstName || !lastName) ? false : true;
  }

  const handleFormSubmit = async (evt) => {
    evt.preventDefault();

    if (!isFormValid) {
      return dispatch({
        type: SET_FORM_MESSAGE,
        payload: {
          isError: true,
          content: 'Missing fields',
        }
      });
    }

    const { firstName, lastName } = userDetails;
    const displayName = `${firstName} ${lastName}`;

    try {
      await Promise.all([updateFirebaseProfile(displayName), updateFirebaseExtendedUserDetails()]);

      dispatch({
        type: SET_FORM_MESSAGE,
        payload: {
          isError: false,
          content: 'Profile updated.',
        }
      });
    } catch (error) {
      dispatch({
        type: SET_FORM_MESSAGE,
        payload: {
          isError: true,
          content: 'Error updating user profile. Please try again.',
        }
      });
    }
  }

  // Should this be an external helper that is reusable for photo upload?
  const updateFirebaseProfile = (displayName) => {
    return new Promise(async (resolve, reject) => {
      try {
        await firebase.updateProfile({ displayName });
      } catch (error) {
        return reject(error);
      }
      resolve();
    })
  }

  const generateFavoriteGenresObject = () => {
    const { favoriteGenres } = userDetails;
    const favoriteGenresObject = {};

    for (let i = 0; i < favoriteGenres.length; i++) {
      favoriteGenresObject[favoriteGenres[i]] = true;
    }

    return favoriteGenresObject;
  }

  const generateExtendedUserDetailsObject = () => {
    const favoriteGenresObject = generateFavoriteGenresObject();
    const { biography, websiteURL } = userDetails;

    return {
      favoriteGenres: {
        ...favoriteGenresObject
      },
      biography,
      websiteURL,
    }
  }

  const updateFirebaseExtendedUserDetails = () => {
    return new Promise((resolve, reject) => {
      if (!uid) return reject('No user id found');
      const extendedUserDetailsObject = generateExtendedUserDetailsObject();

      try {
        const userExtendedRef = db.ref(`usersExtended/${uid}`);
        userExtendedRef.set(extendedUserDetailsObject, (error) => {
          if (error) {
            throw new Error(`Error updating firebase: ${error}`);
          }
        })

      } catch (error) {
        return reject(error);
      }

      resolve();
    });
  }

  const handleFavoriteGenreChange = (e, val) => {
    const { value: genres } = val;

    dispatch({
      type: SET_FAVORITE_GENRES,
      payload: {
        genres,
      },
    })
  }

  if (!uid) {
    return <LoggedOutMessage />
  }

  return (
    <Grid columns={2} textAlign='left'>
      <Grid.Column computer={4} mobile={16}>
        <PhotoUpload />
      </Grid.Column>
      <Grid.Column computer={12} mobile={16}>
        <Form onSubmit={handleFormSubmit}>
          <Form.Group widths='equal'>
            <Form.Field>
              <label>First Name</label>
              <Input
                fluid
                name='firstName'
                placeholder='First Name'
                maxLength='100'
                required
                onChange={(evt) => handleInputChange(evt)}
                value={state.userDetails.firstName || ''}
              />
            </Form.Field>
            <Form.Field>
              <label>Last Name</label>
              <Input
                fluid
                name='lastName'
                placeholder='Last Name'
                maxLength='100'
                required
                onChange={(evt) => handleInputChange(evt)}
                value={state.userDetails.lastName || ''}
              />
            </Form.Field>
          </Form.Group>
          <Form.Field>
            <label>Favorite Genres</label>
            <Dropdown
              placeholder='Techno, Progressive House, House'
              multiple
              search
              selection
              fluid
              options={genreList}
              onChange={handleFavoriteGenreChange}
              value={userDetails.favoriteGenres || []}
            />
          </Form.Field>
          <Form.Field>
            <label>Biography</label>
            <TextArea
              name='biography'
              onChange={(evt) => handleInputChange(evt)}
              value={userDetails.biography}
            />
          </Form.Field>
          <Form.Field>
            <label>Website</label>
            <Input
              fluid
              type='url'
              pattern='https://.*'
              name='websiteURL'
              placeholder='https://google.com'
              maxLength='2000'
              onChange={(evt) => handleInputChange(evt)}
              value={state.userDetails.websiteURL || ''}
            />
          </Form.Field>
          <Message
            attached='bottom'
            positive={!formMessage.isError}
            error={formMessage.isError}
            content={formMessage.content}
            hidden={!formMessage.content || (formMessage.content && formMessage.content.length === 0) || !isPristine}
          />
          <Button type='submit' positive disabled={isPristine}>Update</Button>
        </Form>
      </Grid.Column>
    </Grid>
  );
};

const mapStateToProps = (state) => {
  const { genreListing } = state;
  const genreList = genreListing.map(genre => {
    const { id: key, name: text, slug: value } = genre;
    return (
      {
        key,
        text,
        value,
      }
    )
  });


  return {
    genreList,
    uid: getUserId(state),
  }
}

export default connect(mapStateToProps, null)(MyProfile);
