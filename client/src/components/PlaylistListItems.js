import React from 'react';
import { List, Checkbox } from 'semantic-ui-react';

const PlaylistListItems = ({ playlistList, track, addToPlaylist }) => {
  const playlistItems = playlistList.map(playlist => {
    const added = playlist.listOfTracks && playlist.listOfTracks.includes(track.id);
    const { tracks = {}, id: playlistId } = playlist;

    const listItemStyle = {
      cursor: 'pointer',
    }

    return (
      <List.Item
        onClick={() => addToPlaylist({ id: playlistId, added })}
        style={listItemStyle}
        key={playlistId}
      >
        <List.Content floated='right'>
          <Checkbox checked={added} />
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
