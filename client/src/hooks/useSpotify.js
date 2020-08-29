import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import Axios from 'axios';

function useSpotify() {
  const spotifyToken = Cookies.get('spotify_access_token');
  const spotifyRefreshToken = Cookies.get('spotify_refresh_token');

  const axiosGETConfig = {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${spotifyToken}`,
    },
  };

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const axios = Axios.create();
  axios.interceptors.response.use(null, authInterceptor);

  useEffect(() => {
    console.log('inside useEffect', spotifyRefreshToken, spotifyToken);
    // see if we can set logged in status to true
    async function getUserProfile(){
      if (spotifyRefreshToken && spotifyToken) {
        const url = 'https://api.spotify.com/v1/me';
        const result = await callSpotify(url);
        console.log('profile', result);
      }
    }

    getUserProfile();
  }, []);

  const refreshSpotifyToken = async () => {
    return new Promise(async (resolve, reject) => {
      // if a refresh token doesn't exists, gtfo. consumer should then display a spotify auth button
      if (!spotifyRefreshToken) {
        return reject('missing_refresh_token');
      }

      try {
        const result = await Axios.get(
          `/api/spotify-refresh-token?spotifyRefreshToken=${spotifyRefreshToken}`,
        );

        if (result && result.data) {
          return resolve(result.data.accessToken);
        }
      } catch (error) {
        reject(error);
      }
    });
  };

  async function authInterceptor(error) {
    const originalRequest = error.config;

    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry
    ) {
      console.log('401!!! time to refresh');

      // refresh token
      let token;
      try {
        token = await refreshSpotifyToken();
        console.log('new token', token);
      } catch (error) {
        return error;
      }

      // set new token in auth header and cookie
      Cookies.set('spotify_access_token', token);
      originalRequest.headers['Authorization'] = `Bearer ${token}`;
      originalRequest._retry = true;

      // retry request
      return axios(originalRequest);
    } else {
      return error;
    }
  }

  const callSpotify = async (url) => {
    let result;
    try {
      result = await axios.get(url, axiosGETConfig);
    } catch (error) {
      console.log('error in callSpotify', error);
      return error;
    }

    console.log('resuslt', result);

    if (result && result.data) {
      return result.data;
    }

    return result;
  };

  return {
    callSpotify,
  };
}

export default useSpotify;
