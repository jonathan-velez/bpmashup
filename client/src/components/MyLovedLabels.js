import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { animateScroll } from 'react-scroll';
import { withRouter } from 'react-router-dom';
import queryString from 'query-string';

import { DEFAULT_PAGE } from '../constants/defaults';
import { getLabelsById } from '../thunks';
import { getPerPageSetting } from '../utils/helpers';
import LovedLabelsTable from './LovedLabelsTable';
import NothingHereMessage from './NothingHereMessage';
import Pager from './Pager';

const MyLovedLabels = ({
  location,
  lovedLabels = {},
  lovedLabelsDetails,
  getLabelsById,
}) => {
  const {
    page = DEFAULT_PAGE,
    perPage = getPerPageSetting(),
  } = queryString.parse(location.search);
  const { labels = {}, metadata = {} } = lovedLabelsDetails;
  const {
    totalPages,
    query,
    page: activePage,
    perPage: activePerPage,
  } = metadata;

  useEffect(() => {
    const fetchMyFavoriteLabels = (labelIds = [], page, perPage) => {
      if (labelIds.length > 0) {
        animateScroll.scrollToTop({ duration: 300 });
        getLabelsById(labelIds.join(','), page, perPage);
      }
    };

    const lovedLabelIds = Object.keys(lovedLabels);

    if (lovedLabelIds && lovedLabelIds.length > 0) {
      fetchMyFavoriteLabels(lovedLabelIds, page, perPage);
    }
  }, [getLabelsById, lovedLabels, page, perPage]);

  if (lovedLabels.length === 0) {
    return <NothingHereMessage />;
  }

  return (
    <React.Fragment>
      <LovedLabelsTable labels={labels} />
      {totalPages && totalPages > 1 && (
        <Pager
          activePage={activePage}
          totalPages={totalPages}
          firstItem={null}
          lastItem={null}
          perPage={activePerPage}
          query={query}
        />
      )}
    </React.Fragment>
  );
};

const mapStateToProps = (state) => {
  const { lovedLabels, lovedLabelsDetails } = state;
  return {
    lovedLabels,
    lovedLabelsDetails,
  };
};

const mapDispatchToProps = {
  getLabelsById,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withRouter(MyLovedLabels));
