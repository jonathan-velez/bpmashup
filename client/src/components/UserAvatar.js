import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { firebaseConnect } from 'react-redux-firebase';
import { Image } from 'semantic-ui-react';

const UserAvatar = ({ profile }) => {
  const { photoURL } = profile

  return (
    <Image
      src={photoURL}
      size='mini'
      circular
    />
  );
};


export default compose(
  firebaseConnect(),
  connect(({ firebaseState: { profile } }) => ({ profile }))
)(UserAvatar);
