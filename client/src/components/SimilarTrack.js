import React from 'react';
import { withRouter } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { Button, Icon, Menu } from 'semantic-ui-react';

const SimilarTrack = ({ history, track, type = 'dropdownItem' }) => {
  const findSimilarTracks = () => {
    history.push(`/similar-tracks/${track.slug}/${track.id}`);
  };

  return type === 'dropdownItem' ? (
    <Menu.Item onClick={findSimilarTracks}>
      <Icon name='search' />
      Similar Tracks
    </Menu.Item>
  ) : (
    <Button basic>
      <Button.Content visible>
        <Link to={`/similar-tracks/${track.slug}/${track.id}`}>
          <Icon name='search' />
        </Link>
      </Button.Content>
    </Button>
  );
};

export default withRouter(SimilarTrack);
