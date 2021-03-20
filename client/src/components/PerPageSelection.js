import React from 'react';
import { withRouter } from 'react-router-dom';
import { Button } from 'semantic-ui-react';
import queryString from 'query-string';

import { getPerPageSetting, setPerPageSetting } from '../utils/helpers';

class PerPageSelection extends React.PureComponent {
  render() {
    const { activePage = 1, totalPages, per_page = getPerPageSetting(), history } = this.props;
    if (!totalPages) return null;

    const updatePerPage = (per_page) => {
      const { search, pathname } = history && history.location;
      const parsedSearch = queryString.parse(search);

      const newSearchString = queryString.stringify({
        ...parsedSearch,
        page: activePage || 1,
        per_page,
      });

      const pushObject = {
        pathname,
        search: newSearchString,
      }

      setPerPageSetting(per_page);
      history.push(pushObject);
    }

    return (
      <Button.Group basic>
        <Button onClick={() => updatePerPage('25')} active={per_page === 25}>25</Button>
        <Button onClick={() => updatePerPage('50')} active={per_page === 50}>50</Button>
        <Button onClick={() => updatePerPage('75')} active={per_page === 75}>75</Button>
        <Button onClick={() => updatePerPage('100')} active={per_page === 100}>100</Button>
      </Button.Group>
    );
  }
}

export default withRouter(PerPageSelection);
