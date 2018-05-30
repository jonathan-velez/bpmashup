import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Confirm } from 'semantic-ui-react';

import * as actionCreators from '../actions/ActionCreators';

class ConfirmController extends Component {
  state = {
    result: false,
  }

  handleCancel = () => {
    this.props.setConfirm(false);
  }

  handleConfirm = () => {
    this.props.setConfirm(true);
  }

  render() {
    return (
      <React.Fragment>
        <Confirm
          size='small'
          open={this.props.confirmModal.open}
          onCancel={this.handleCancel}
          onConfirm={this.handleConfirm}
          content={this.props.confirmModal.content}
          confirmButton={this.props.confirmModal.confirmButtonText}
          cancelButton={this.props.confirmModal.cancelButtonText}
        />
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => {
  return {
    confirmModal: state.confirmModal,
  }
}

const mapDispatchToProps = dispatch => {
  return bindActionCreators(actionCreators, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(ConfirmController);
