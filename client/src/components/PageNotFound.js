import React, { useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import { Message, Header } from 'semantic-ui-react';

const PageNotFound = ({ history }) => {
  useEffect(() => {
    setTimeout(() => {
      history.push('/');
    }, 3000);
  }, [history]);
  
  return (
    <Message negative>
      <Header size='huge'>Lost?</Header>
      <p>Page not found. You'll be redirected to the home page shortly.</p>
    </Message>
  );
};

export default withRouter(PageNotFound);
