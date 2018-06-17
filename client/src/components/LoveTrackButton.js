import React from 'react';
import { Button, Icon } from 'semantic-ui-react';

const LoveTrackButton = ({ track }) => {
  return (
    <Button basic>
      <Button.Content visible>
        <Icon color='red' name='heart' />
      </Button.Content>
    </Button>
  );
};

export default LoveTrackButton;
