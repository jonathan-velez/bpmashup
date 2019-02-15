import React from 'react';
import { connect } from 'react-redux';
import { Item } from 'semantic-ui-react';

const YouTubeButtonPopup = ({ youTubeObject }) => {
  return (
    <Item.Group>
      <Item>
        <Item.Image size='tiny' src={youTubeObject.youTubeImageUrl} />
        <Item.Content verticalAlign='middle'>
          <Item.Header><a href={youTubeObject.youTubeUrl} target="_blank" rel="noopener noreferrer">{youTubeObject.youTubeTitle}</a></Item.Header>
        </Item.Content>
      </Item>
    </Item.Group>
  );
};

const mapStateToProps = state => {
  return {
    youTubeObject: state.mediaPlayer.youTubeObject,
  }
}

export default connect(mapStateToProps, {})(YouTubeButtonPopup);
