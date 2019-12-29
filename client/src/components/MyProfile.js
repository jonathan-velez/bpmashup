import React, { useReducer, useEffect } from 'react';
import { connect } from 'react-redux';
import firebase from 'firebase';
import { Grid, Form, Input, Button, Message, Dropdown, TextArea } from 'semantic-ui-react';

import PhotoUpload from './PhotoUpload';
import { getUserId, getFirstAndLastName } from '../selectors';

const INPUT_CHANGE = 'INPUT_CHANGE';
const SET_FORM_MESSAGE = 'SET_FORM_MESSAGE';
const CLEAR_FORM_ERROR_MESSAGE = 'CLEAR_FORM_ERROR_MESSAGE';
const SET_FAVORITE_GENRES = 'SET_FAVORITE_GENRES';
const SET_INITIAL_FORM_VALUES = 'SET_INITIAL_FORM_VALUES';
const SET_FORM_PRISTINE = 'SET_FORM_PRISTINE';

const MyProfile = ({ uid, genreList, firstName, lastName }) => {
  const initialState = {
    isPristine: true,
    formMessage: {
      isError: false,
      content: null,
    },
    userDetails: {
      firstName,
      lastName,
      favoriteGenres: [],
    }
  }

  const reducer = (state, action) => {
    const { type, payload } = action;

    switch (type) {
      case INPUT_CHANGE: {
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
          formMessage: {
            isError: payload.isError,
            content: payload.content,
          }
        }
      }
      case CLEAR_FORM_ERROR_MESSAGE: {
        return {
          ...state,
          formMessage: {
            isError: false,
            content: null,
          }
        }
      }
      // should we change this to an object to reflect firebase data structure or keep converting to/from array/object?
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
        const { firstName, lastName } = payload;

        return {
          ...state,
          isPristine: true,
          userDetails: {
            ...state.userDetails,
            firstName,
            lastName,
          }
        }
      }
      case SET_FORM_PRISTINE: {
        return {
          ...state,
          isPristine: payload,
        }
      }
      default: {
        return state
      }
    }
  }

  const [state, dispatch] = useReducer(reducer, initialState);
  const { userDetails, formMessage, isPristine } = state;



  useEffect(() => {
    const db = firebase.database();
    const favoriteGenresRef = db.ref(`usersExtended/${uid}/favoriteGenres`);

    favoriteGenresRef.once('value', (snapshot) => {
      const favoriteGenres = snapshot.val();
      if (!favoriteGenres) return;

      dispatch({
        type: SET_FAVORITE_GENRES,
        payload: {
          isInitial: true,
          genres: Object.keys(favoriteGenres),
        }
      });
    });

  }, [uid]);

  useEffect(() => {
    dispatch({
      type: SET_INITIAL_FORM_VALUES,
      payload: {
        firstName,
        lastName,
      }
    });
  }, [firstName, lastName]);

  const handleInputChange = (evt) => {
    const { name: inputName, value: inputValue } = evt && evt.target;

    dispatch({
      type: INPUT_CHANGE,
      payload: {
        inputName,
        inputValue,
      }
    });
  }

  const handleFormSubmit = async (evt) => {
    evt.preventDefault();

    const { firstName, lastName } = state.userDetails;
    const displayName = `${firstName} ${lastName}`;

    if (!firstName || !lastName) {
      return dispatch({
        type: SET_FORM_MESSAGE,
        payload: {
          isError: true,
          content: 'Missing fields',
        }
      })
    }

    await updateProfile(displayName);
    await updateFavoriteGenres();

    dispatch({
      type: SET_FORM_MESSAGE,
      payload: {
        isError: false,
        content: 'Profile updated.',
      }
    });

    dispatch({
      type: SET_FORM_PRISTINE,
      payload: true,
    })
  }

  // Should this be an external helper that is reusable for photo upload?
  const updateProfile = (displayName) => {
    return new Promise(async (resolve, reject) => {
      try {
        const fbResult = await firebase.updateProfile({ displayName });
        console.log(fbResult);
      } catch (error) {
        console.error('error updating profile', error);
        return reject(error);
      }
      resolve();
    })
  }

  const updateFavoriteGenres = () => {
    return new Promise((resolve, reject) => {
      if (!uid) return reject('No user id found');

      const { favoriteGenres } = userDetails;
      if (favoriteGenres.length === 0) return reject('No favorite genres found');

      try {
        const favoriteGenresObject = {};

        for (let i = 0; i < favoriteGenres.length; i++) {
          favoriteGenresObject[favoriteGenres[i]] = true;
        }

        const db = firebase.database();
        const favoriteGenresRef = db.ref(`usersExtended/${uid}/favoriteGenres`);

        favoriteGenresRef.set(favoriteGenresObject, (err) => {
          if (err) {
            console.error('Error saving favorite genres');
            throw new Error(err);
          } else {
            console.log('saved fav genres to fb');
          }
        })

      } catch (error) {
        console.error('Error updating favorite genres', error);
        return reject(error);
      }

      resolve();
    })
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
              <Input fluid name='firstName' placeholder='First Name' required onChange={(evt) => handleInputChange(evt)} value={state.userDetails.firstName} />
            </Form.Field>
            <Form.Field>
              <label>Last Name</label>
              <Input fluid name='lastName' placeholder='Last Name' required onChange={(evt) => handleInputChange(evt)} value={state.userDetails.lastName} />
            </Form.Field>
          </Form.Group>
          {/* <Form.Field>
            <label>Phone Number</label>
            <Input type='tel' placeholder='310-555-1234' pattern='[0-9]{3}-[0-9]{3}-[0-9]{4}' onChange={(evt) => handleInputChange(evt)} />
          </Form.Field> */}
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
            <TextArea />
          </Form.Field>
          <Message
            attached='bottom'
            positive={!formMessage.isError}
            error={formMessage.isError}
            content={formMessage.content}
            hidden={!formMessage.content || (formMessage.content && formMessage.content.length === 0)}
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

  const [firstName, lastName] = getFirstAndLastName(state) || ['', ''];

  return {
    genreList,
    uid: getUserId(state),
    firstName,
    lastName,
  }
}

export default connect(mapStateToProps, null)(MyProfile);
