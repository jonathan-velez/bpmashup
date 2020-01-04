import React from 'react';
import { Message } from 'semantic-ui-react';

const LoggedOutMessage = () => {
  return (
    <Message negative content='You must be logged in to access this page.' />
  );
};

export default LoggedOutMessage;
