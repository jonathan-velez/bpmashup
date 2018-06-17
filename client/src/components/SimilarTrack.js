import React from 'react';
import { withRouter } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { Button, Icon, Dropdown } from 'semantic-ui-react';

const SimilarTrack = ({ history, track, type = 'dropdownItem' }) => {
  const findSimilarTracks = (trackSlug, trackId) => {
    history.push(`/similar-tracks/${trackSlug}/${trackId}`);
  }

  return type === 'dropdownItem' ?
    <Dropdown.Item icon='search' text='Similar Tracks' onClick={() => findSimilarTracks(track.slug, track.id)} />
    : (
      <Button basic>
        <Button.Content visible>
          <Link to={`/similar-tracks/${track.slug}/${track.id}`}><Icon name='search' /></Link>
        </Button.Content>
      </Button>
    );
};

export default withRouter(SimilarTrack);
