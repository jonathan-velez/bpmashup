import React from 'react';
import { withRouter } from 'react-router-dom';
import { Button } from 'semantic-ui-react';

const PerPageSelection = ({ activePage = 1, totalPages, perPage = 25, history }) => {
  if (!totalPages) return null;

  const updatePerPage = (perPage) => {
    history.push(`?perPage=${perPage}&page=${activePage}`);
  }

  return (
    <Button.Group basic>
      <Button onClick={() => updatePerPage('25')} active={perPage === 25}>25</Button>
      <Button onClick={() => updatePerPage('50')} active={perPage === 50}>50</Button>
      <Button onClick={() => updatePerPage('75')} active={perPage === 75}>75</Button>
      <Button onClick={() => updatePerPage('100')} active={perPage === 100}>100</Button>
    </Button.Group>
  );
};

export default withRouter(PerPageSelection);
