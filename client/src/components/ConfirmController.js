import React, { useCallback } from 'react';
import { connect } from 'react-redux';
import { Confirm } from 'semantic-ui-react';

import { setConfirm } from '../actions/ActionCreators';

const ConfirmController = ({ confirmModal, setConfirm }) => {
  const handleCancel = useCallback(() => {
    setConfirm(false);
  }, [setConfirm]);

  const handleConfirm = useCallback(() => {
    setConfirm(true);
  }, [setConfirm]);

  return (
    <Confirm
      size='small'
      open={confirmModal.open}
      onCancel={handleCancel}
      onConfirm={handleConfirm}
      content={confirmModal.content}
      confirmButton={confirmModal.confirmButtonText}
      cancelButton={confirmModal.cancelButtonText}
    />
  );
}

const mapStateToProps = (state) => {
  return {
    confirmModal: state.confirmModal,
  }
}

const mapDispatchToProps = {
  setConfirm,
}

export default connect(mapStateToProps, mapDispatchToProps)(ConfirmController);
