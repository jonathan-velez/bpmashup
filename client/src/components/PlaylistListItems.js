import React from 'react';
import { List, Checkbox } from 'semantic-ui-react';
import _ from 'lodash';

const PlaylistListItems = ({ playlistList, track, addToPlaylist }) => {
  const playlistItems = _.map(_.sortBy(playlistList, 'dateAdded'), playlist => {
    const added = playlist.listOfTracks && playlist.listOfTracks.includes(track.id);
    const { tracks = {} } = playlist;

    return (
      <List.Item key={playlist.id}>
        <List.Content floated='right'>
          <Checkbox onClick={() => addToPlaylist({ id: playlist.id, added })} checked={added} />
        </List.Content>
        <List.Content className={added ? 'boldedText' : ''}>{playlist.name} ({Object.keys(tracks).length})</List.Content>
      </List.Item>
    )
  });
  return (
    <React.Fragment>
      {playlistItems}
    </React.Fragment>
  );

}

export default PlaylistListItems;