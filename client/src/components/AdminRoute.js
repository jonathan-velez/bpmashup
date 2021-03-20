import React from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';

import { isAdmin } from '../selectors';

const AdminRoute = ({ component: Component, isAdmin, ...props }) => {
  // if (!isAdmin) {
  //   return <Redirect to={{ pathname: '/' }} />;
  // }

  return <Component {...props} />;
};

const mapStateToProps = (state) => {
  return {
    isAdmin: isAdmin(state),
  };
};

export default connect(
  mapStateToProps,
  null,
)(AdminRoute);
