import React from 'react';
import { List, Checkbox } from 'semantic-ui-react';

const PlaylistListItems = ({ playlistList, track, addTrackToPlaylist }) => {
  const playlistItems = playlistList.map((playlist) => {
    const { id: playlistId, trackIds = [] } = playlist;
    const added = trackIds && trackIds.includes(track.id);

    const listItemStyle = {
      cursor: 'pointer',
    };

    return (
      <List.Item
        onClick={() => addTrackToPlaylist({ id: playlistId, added })}
        style={listItemStyle}
        key={playlistId}
      >
        <List.Content floated='right'>
          <Checkbox checked={added} />
        </List.Content>
        <List.Content className={added ? 'boldedText' : ''}>
          {playlist.name} ({trackIds.length})
        </List.Content>
      </List.Item>
    );
  });
  return <React.Fragment>{playlistItems}</React.Fragment>;
};

export default PlaylistListItems;
