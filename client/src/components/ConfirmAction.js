import React, { useState, useEffect } from 'react';
import { Confirm } from 'semantic-ui-react';

const ConfirmAction = ({
  action,
  confirmSize = 'tiny',
  confirmText,
  confirmButtonText,
  cancelButtonText,
  render,
}) => {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [userConfirmed, setUserConfirmed] = useState(false);

  useEffect(() => {
    if (!confirmOpen) {
      if (userConfirmed) {
        action();
      }
    }
  }, [confirmOpen, userConfirmed, action]);

  const openConfirm = () => {
    setConfirmOpen(true);
  }

  const handleUserConfirm = (confirm) => {
    setConfirmOpen(false);
    setUserConfirmed(confirm);
  }

  return (
    <React.Fragment>
      {render(openConfirm)}
      <Confirm
        size={confirmSize}
        open={confirmOpen}
        onCancel={() => handleUserConfirm(false)}
        onConfirm={() => handleUserConfirm(true)}
        content={confirmText}
        confirmButton={confirmButtonText}
        cancelButton={cancelButtonText}
      />
    </React.Fragment>
  )
};

export default ConfirmAction;
