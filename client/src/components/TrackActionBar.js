import React from 'react';
import { Card, Icon, Button } from 'semantic-ui-react';

import AddToPlaylist from './AddToPlaylist';

const TrackActionBar = props => {
  return (
    <Card.Content extra>
      <div className='ui two buttons'>
        <Button
          basic
          animated
          color='grey'
          onClick={(e, d) => console.log('download', e, d, props.track.id)}
        >
          <Button.Content visible>
            <Icon name='download' />
          </Button.Content>
          <Button.Content hidden>Download</Button.Content>
        </Button>
        <AddToPlaylist track={props.track} />
      </div>
    </Card.Content>
  )
}

export default TrackActionBar;