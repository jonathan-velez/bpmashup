import React from 'react';
import { Message, Header } from 'semantic-ui-react';

const NothingHereMessage = () => {
  return (
    <Message warning>
      <Header size='huge'>Hey!</Header>
      <p>Nothing to display.</p>
    </Message>
  );
};

export default NothingHereMessage;
