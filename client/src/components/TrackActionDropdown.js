import React from 'react';
import { Dropdown } from 'semantic-ui-react';

const TrackActionDropdown = ({ downloadTrack, removeFromPlaylist, findSimilarTracks, track, ellipsisOrientation = 'vertical' }) => {
  return (
    <Dropdown icon={`ellipsis ${ellipsisOrientation}`} floating>
      <Dropdown.Menu className='trackActionDropdown'>
        <Dropdown.Item icon='download' text='Download' onClick={() => downloadTrack(track)} />
        <Dropdown.Item icon='delete' text='Delete' onClick={() => removeFromPlaylist(track.id.toString())} />
        <Dropdown.Item icon='search' text='Similar Tracks' onClick={() => findSimilarTracks(track.slug, track.id)} />
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default TrackActionDropdown;
