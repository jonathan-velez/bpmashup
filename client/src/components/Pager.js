import React from 'react';
import { withRouter } from 'react-router-dom';
import { Pagination } from 'semantic-ui-react';

const Pager = ({ activePage, totalPages, perPage, history }) => {
  const pagerStyle = {
    'marginTop': '15px'
  };

  if (!totalPages) return null;

  return (
    <Pagination
      style={pagerStyle}
      activePage={activePage}
      totalPages={totalPages}
      onPageChange={(e, data) => history.push(`?perPage=${perPage}&page=${data.activePage || 1}`)}
    />
  );
};

export default withRouter(Pager);