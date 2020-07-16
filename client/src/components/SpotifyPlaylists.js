import React, { useEffect, useState } from 'react';
import querystring from 'query-string';
import Cookies from 'js-cookie';
import axios from 'axios';
import { Header, List } from 'semantic-ui-react';

const SpotifyPlaylists = () => {
  const [playlists, setPlaylists] = useState([]);
  const [spotifyToken, setSpotifyToken] = useState(
    Cookies.get('spotify_access_token'),
  );
  const [spotifyRefreshToken, setSpotifyRefreshToken] = useState(
    Cookies.get('spotify_refresh_token'),
  );
  const SPOTIFY_CLIENT_ID = '5cb7ddeef8404b3bb847578bb9704d27';

  const axiosGETConfig = {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${spotifyToken}`,
    },
  };
  const axiosPOSTConfig = {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Bearer ${spotifyToken}`,
      client_id: SPOTIFY_CLIENT_ID,
    },
  };

  console.log('axiosGETConfig', axiosGETConfig);

  useEffect(() => {
    const refreshToken = async (callback) => {
      if (spotifyRefreshToken) {
        const refreshPOSTUrl = 'https://accounts.spotify.com/api/token';
        const refreshData = {
          grant_type: 'refresh_token',
          refresh_token: spotifyRefreshToken,
        };

        let result;
        try {
          result = await axios.post(
            refreshPOSTUrl,
            querystring.stringify(refreshData),
            axiosPOSTConfig,
          );
        } catch (error) {
          console.log('error refreshing token', error);
        }

        if (result && result.data) {
          console.log('refresh token data', result.data);
          const { access_token } = result.data;
          setSpotifyToken(access_token);
          callback();
        }
      }
    };

    const getMyPlaylists = async () => {
      let result;
      try {
        result = await axios.get(
          `https://api.spotify.com/v1/me/playlists?limit=100&offset=0`,
          axiosGETConfig,
        );
      } catch (error) {
        console.log('error calling spotify', error); //401?
        // refresh token
        // refreshToken(getMyPlaylists);
      }

      console.log('result!!!', result);

      if (
        result &&
        result.data &&
        result.data.items &&
        result.data.items.length > 0
      ) {
        setPlaylists(result.data.items);
      }
    };

    getMyPlaylists();
  }, []);

  const refreshSpotifyToken = async () => {
    const result = await axios.get(
      `/api/spotify-refresh-token?spotifyRefreshToken=${spotifyRefreshToken}`,
    );

    console.log(result && result.data);
  };

  const getPlaylistTracks = async (playlistId) => {
    const url = `https://api.spotify.com/v1/playlists/${playlistId}/tracks`;
    const result = await axios.get(url, axiosGETConfig);
    const { data = {} } = result;
    console.log('playlist data', data);
  };

  return (
    <div>
      <Header>Spotify Playlists</Header>
      <List>
        {playlists.map((list) => (
          <List.Item
            key={list.id}
            onClick={() => getPlaylistTracks(list.id)}
            as='a'
          >
            {list.name}
          </List.Item>
        ))}
      </List>
      <button onClick={refreshSpotifyToken}>Refresh token</button>
    </div>
  );
};

export default SpotifyPlaylists;
