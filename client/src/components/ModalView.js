import React from 'react';
import { Modal, Header } from 'semantic-ui-react';

const ModalView = props => {
  return (
    <Modal
      open={props.open}
      onClose={props.handleClose}
      onMount={props.handleOpen}
      size='tiny'
    >
      <Header icon={props.headerIcon} content={props.modalHeader} />
      <Modal.Content>
        {props.modalContent}
      </Modal.Content>
    </Modal>
  )
}

export default ModalView;