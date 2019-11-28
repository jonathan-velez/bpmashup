import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { animateScroll } from 'react-scroll';
import queryString from 'query-string';

import { DEFAULT_PAGE } from '../constants/defaults';
import { getLabelsById } from '../thunks';
import { getPerPageSetting } from '../utils/helpers';
import LovedLabelsTable from './LovedLabelsTable';
import NothingHereMessage from './NothingHereMessage';
import Pager from './Pager';

const MyLovedLabels = ({ location, lovedLabels = [], lovedLabelsDetails, getLabelsById }) => {
  const { page = DEFAULT_PAGE, perPage = getPerPageSetting() } = queryString.parse(location.search);
  const { labels = {}, metadata = {} } = lovedLabelsDetails;
  const { totalPages, query, page: activePage, perPage: activePerPage } = metadata;

  if (lovedLabels.length === 0) {
    return <NothingHereMessage />;
  }

  useEffect(() => {
    if (lovedLabels && lovedLabels.length > 0) {
      fetchMyFavoriteLabels(lovedLabels, page, perPage);
    }
  }, [lovedLabels, page, perPage]);

  const fetchMyFavoriteLabels = (labelIds = [], page, perPage) => {
    if (labelIds.length > 0) {
      animateScroll.scrollToTop({ duration: 300 });
      getLabelsById(labelIds.join(','), page, perPage);
    }
  }

  return (
    <React.Fragment>
      <LovedLabelsTable labels={labels} />
      {totalPages && totalPages > 1 ?
        <Pager activePage={activePage} totalPages={totalPages} firstItem={null} lastItem={null} perPage={activePerPage} query={query} />
        :
        null
      }
    </React.Fragment>
  )
}

const mapStateToProps = (state) => {
  const { lovedLabels, lovedLabelsDetails } = state;
  return {
    lovedLabels,
    lovedLabelsDetails,
  }
}

const mapDispatchToProps = {
  getLabelsById,
}

export default connect(mapStateToProps, mapDispatchToProps)(MyLovedLabels);
