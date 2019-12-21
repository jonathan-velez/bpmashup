import React from 'react';
import { connect } from 'react-redux';
import { Header } from 'semantic-ui-react';

import { getUserDisplayName } from '../selectors';

const NameBadge = ({ displayName }) => {
  return (
    <Header>
      {displayName}
    </Header>
  );
};

const mapStateToProps = (state) => {
  return {
    displayName: getUserDisplayName(state),
  }
}

export default connect(mapStateToProps, null)(NameBadge);
