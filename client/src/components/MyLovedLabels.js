import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Scroll from 'react-scroll';

import { getLabelsById } from '../thunks';
import { startAsync } from '../actions/ActionCreators';
import LovedLabelsTable from './LovedLabelsTable';
import Pager from './Pager';

class MyLovedLabels extends React.Component {
  componentDidMount() {
    const { lovedLabels } = this.props;

    if (lovedLabels && lovedLabels.length > 0) {
      this.fetchMyFavoriteLabels(lovedLabels);
    }
  }

  componentWillReceiveProps(nextProps) {
    const { location, isLoading } = this.props;
    const { lovedLabels = [], lovedLabelsDetails, location: nextLocation } = nextProps;
    const { metadata } = lovedLabelsDetails;
    const { count: loadedCount = 0 } = metadata;

    if (isLoading) return;

    // parse query params
    const { search: nextSearch } = nextLocation;
    const { search: thisSearch } = location;
    const thisParams = {};
    thisSearch.replace('?', '').split('&').forEach(param => {
      const splitParam = param.split('=');
      thisParams[splitParam[0]] = splitParam[1];
    });
    const nextParams = {};
    nextSearch.replace('?', '').split('&').forEach(param => {
      const splitParam = param.split('=');
      nextParams[splitParam[0]] = splitParam[1];
    });

    // which page are we loading?
    const thisPage = +thisParams.page || 1;
    const newPage = +nextParams.page || 1;

    // how many per page?
    const thisPerPage = +thisParams.perPage || 10;
    const newPerPage = +nextParams.perPage || 10;

    if (lovedLabels.length !== loadedCount || (thisPage !== newPage || thisPerPage !== newPerPage)) {
      this.fetchMyFavoriteLabels(lovedLabels, newPage, newPerPage);
    }
  }

  fetchMyFavoriteLabels(labelIds = [], page = 1, perPage = 10) {
    if (labelIds && labelIds.length > 0) {
      const { getLabelsById, startAsync } = this.props;
      startAsync();
      Scroll.animateScroll.scrollToTop({ duration: 1000 });
      getLabelsById(labelIds.join(','), page, perPage);
    }
  }

  render() {
    const { lovedLabelsDetails } = this.props;
    const { labels, metadata } = lovedLabelsDetails;
    const { totalPages, page, perPage, query } = metadata;

    if (Object.keys(labels) === 0) {
      return null;
    }

    return (
      <React.Fragment>
        <LovedLabelsTable labels={labels} />
        {totalPages && totalPages > 1 ?
          <Pager activePage={page} totalPages={totalPages} firstItem={null} lastItem={null} perPage={perPage || 10} query={query} />
          :
          null
        }
      </React.Fragment>
    )
  }
}

const mapStateToProps = state => {
  return {
    lovedLabels: state.lovedLabels,
    lovedLabelsDetails: state.lovedLabelsDetails,
    lovedArtists: state.lovedArtists,
    lovedArtistsDetails: state.lovedArtistsDetails,
    isLoading: state.isLoading,
  }
}

const mapDispatchToProps = dispatch => {
  return bindActionCreators(Object.assign({}, { getLabelsById, startAsync }), dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(MyLovedLabels);
