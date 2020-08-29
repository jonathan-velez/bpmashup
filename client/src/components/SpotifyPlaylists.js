import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Header, List, Grid, Image, Button } from 'semantic-ui-react';

import useSpotify from '../hooks/useSpotify';
import { addTrackToDownloadQueue } from '../thunks';
import AuthorizeSpotify from './AuthorizeSpotify';

const SpotifyPlaylists = ({ addTrackToDownloadQueue }) => {
  const { callSpotify } = useSpotify();

  const [playlists, setPlaylists] = useState([]);
  const [playlistTracks, setPlaylistTracks] = useState([]);
  const [spotifyIsAuthorized, setSpotifyIsAuthorized] = useState(false);

  useEffect(() => {
    const getPlaylists = async () => {
      const resultData = await callSpotify(
        `https://api.spotify.com/v1/me/playlists?limit=50&offset=0`,
      );

      console.log('inside component: resultData', resultData);

      if (resultData && resultData.items) {
        setPlaylists(resultData.items);
      } else {
        console.log('some failure here or items null', resultData);
        
        if (resultData === 'missing_refresh_token') {
          alert('refresh token failed, display spotify login button');
          setSpotifyIsAuthorized(false);
        }
      }
    };

    if (playlists.length === 0) {
      getPlaylists();
    }
  }, []);

  const getPlaylistTracks = async (playlistId) => {
    const url = `https://api.spotify.com/v1/playlists/${playlistId}/tracks`;
    const resultData = await callSpotify(url);
    if (resultData && resultData.items) {
      setPlaylistTracks(resultData.items);
    }
  };

  const handleAddTrackToDownloadQueue = (track) => {
    addTrackToDownloadQueue(track, 'spotify');
  };

  return (
    <div>
      <Header>Spotify Playlists</Header>
      <Grid columns={2} divided>
        <Grid.Row textAlign='left'>
          <Grid.Column width={4}>
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
          </Grid.Column>
          <Grid.Column width={12}>
            <List divided size='large'>
              {playlistTracks.map((item, idx) => {
                const { track = {} } = item;
                const { id, name, artists = [], album = {}, uri } = track;
                const { images = [] } = album;

                const artistList = artists.map((artist, idx) => {
                  return (idx > 0 ? ', ' : '') + artist.name;
                });

                return (
                  <List.Item key={`${id}-${idx}`}>
                    <Image src={images[0].url} avatar />
                    <List.Content>
                      <List.Header as='a' href={uri}>
                        {name}
                      </List.Header>
                      {artistList}
                    </List.Content>
                    <List.Content floated='right'>
                      <Button
                        primary
                        onClick={() => handleAddTrackToDownloadQueue(track)}
                      >
                        Download
                      </Button>
                    </List.Content>
                  </List.Item>
                );
              })}
            </List>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </div>
  );
};

const mapDispatchToProps = {
  addTrackToDownloadQueue,
};

export default connect(
  null,
  mapDispatchToProps,
)(SpotifyPlaylists);
