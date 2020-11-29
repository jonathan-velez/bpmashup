import React from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';

import { getUserId } from '../selectors';

const ProtectedRoute = ({ component: Component, uid }) => {
  if (!uid) {
    return <Redirect to={{ pathname: '/' }} />;
  }

  return <Component />;
};

const mapStateToProps = (state) => {
  return {
    uid: getUserId(state),
  };
};

export default connect(
  mapStateToProps,
  null,
)(ProtectedRoute);
