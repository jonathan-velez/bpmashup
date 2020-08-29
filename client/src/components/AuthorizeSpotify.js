import React from 'react';
import axios from 'axios';
import { Button } from 'semantic-ui-react';

const AuthorizeSpotify = () => {
  const SPOTIFY_AUTH_URL = 'https://accounts.spotify.com/authorize';
  const SPOTIFY_CLIENT_ID = '5cb7ddeef8404b3bb847578bb9704d27';
  const SPOTIFY_REDIRECT_URI =
    // 'http://localhost:3001/api/spotify-callback';
    // 'http://localhost:3000/spotify-cb';
    'http://localhost:3000/spotify-cb.html';

  const loginToSpotify = () => {
    const spotifyAuthUrl = `${SPOTIFY_AUTH_URL}/?client_id=${SPOTIFY_CLIENT_ID}&response_type=code&redirect_uri=${SPOTIFY_REDIRECT_URI}&show_dialog=false`;
    let popup = window.open(
      spotifyAuthUrl,
      'Login with Spotify!',
      'width=800,height=600',
    );

    window.spotifyCallback = async (payload) => {
      const result = await axios.get(
        '/api/spotify-set-cookies?code=' + payload,
      );

      if (result && result.data) {
        console.log(result.data);
      }

      popup.close();
    };
  };
  return <Button color='green' onClick={loginToSpotify}>Authorize Spotify</Button>
};

export default AuthorizeSpotify;
