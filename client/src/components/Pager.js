import React from 'react';
import { withRouter } from 'react-router-dom';
import { Pagination } from 'semantic-ui-react';
import queryString from 'query-string';

const Pager = ({ activePage, totalPages, perPage, history, isLoading }) => {
  const pagerStyle = {
    'marginTop': '15px'
  };

  if (!totalPages || isLoading) return null;

  return (
    <Pagination
      style={pagerStyle}
      activePage={activePage}
      totalPages={totalPages}
      onPageChange={(e, data) => {
        const { search, pathname } = history && history.location;
        const parsedSearch = queryString.parse(search);

        const newSearchString = queryString.stringify({
          ...parsedSearch,
          page: data.activePage || 1,
          perPage,
        });

        const pushObject = {
          pathname,
          search: newSearchString,
        }
        history.push(pushObject);
      }}
    />
  );
};

export default withRouter(Pager);