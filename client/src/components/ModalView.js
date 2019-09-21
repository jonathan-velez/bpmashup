import React from 'react';
import { Modal, Header } from 'semantic-ui-react';

class ModalView extends React.PureComponent {
  render() {
    const { open, handleClose, handleOpen, headerIcon, modalHeader, modalContent } = this.props;

    return (
      <Modal
        open={open}
        onClose={handleClose}
        onMount={handleOpen}
        size='tiny'
      >
        {modalHeader && <Header className='modal-header' icon={headerIcon} content={modalHeader} />}
        <Modal.Content>
          {modalContent}
        </Modal.Content>
      </Modal>
    )
  }
}

export default ModalView;
