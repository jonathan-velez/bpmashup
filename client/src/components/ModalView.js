import React from 'react';
import { Modal, Header } from 'semantic-ui-react';

const ModalView = ({ open, handleClose, handleOpen, headerIcon, modalHeader, modalContent }) => {
  return (
    <Modal
      open={open}
      onClose={handleClose}
      onMount={handleOpen}
      size='tiny'
    >
      {modalHeader && headerIcon && <Header icon={headerIcon} content={modalHeader} />}
      <Modal.Content>
        {modalContent}
      </Modal.Content>
    </Modal>
  )
}

export default ModalView;
