import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Scroll from 'react-scroll';
import _ from 'lodash';

import { getLabelsById } from '../thunks';
import LovedLabelsTable from './LovedLabelsTable';
import NothingHereMessage from './NothingHereMessage';
import Pager from './Pager';

class MyLovedLabels extends React.Component {
  componentDidMount() {
    const { lovedLabels } = this.props;

    if (lovedLabels && lovedLabels.length > 0) {
      this.fetchMyFavoriteLabels(lovedLabels);
    }
  }

  componentDidUpdate(prevProps) {
    if (_.isEqual(this.props, prevProps)) return;

    const {
      location: thisLocation,
      lovedLabelsDetails = {},
      lovedLabels = [],
      isLoading,
    } = this.props;
    const { location: prevLocation } = prevProps;
    const { labels } = lovedLabelsDetails;

    if (isLoading) return;

    // parse query params
    const { search: prevSearch } = prevLocation;
    const { search: thisSearch } = thisLocation;
    const thisParams = {};
    thisSearch.replace('?', '').split('&').forEach(param => {
      const splitParam = param.split('=');
      thisParams[splitParam[0]] = splitParam[1];
    });
    const prevParams = {};
    prevSearch.replace('?', '').split('&').forEach(param => {
      const splitParam = param.split('=');
      prevParams[splitParam[0]] = splitParam[1];
    });

    // which page are we loading?
    const thisPage = +thisParams.page || 1;
    const prevPage = +prevParams.page || 1;

    // how many per page?
    const thisPerPage = +thisParams.perPage || 10;
    const prevPerPage = +prevParams.perPage || 10;

    if (((Object.keys(labels).length === 0 && lovedLabels.length > 0) || // if label details weren't loaded on mount. usually due to firebase not loaded yet.
      (thisPage !== prevPage || thisPerPage !== prevPerPage)) && // if pagination or per page changes
      !isLoading) { // ensure there's not already an xhr in progress
      this.fetchMyFavoriteLabels(lovedLabels, thisPage, thisPerPage);
    }
  }

  fetchMyFavoriteLabels(labelIds = [], page = 1, perPage = 10) {
    if (labelIds && labelIds.length > 0) {
      const { getLabelsById } = this.props;
      Scroll.animateScroll.scrollToTop({ duration: 1000 });
      getLabelsById(labelIds.join(','), page, perPage);
    }
  }

  render() {
    const { lovedLabelsDetails } = this.props;
    const { labels = {}, metadata = {} } = lovedLabelsDetails;
    const { totalPages, page, perPage, query } = metadata;

    if (Object.keys(labels).length === 0) {
      return <NothingHereMessage />
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
  return bindActionCreators(Object.assign({}, { getLabelsById }), dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(MyLovedLabels);
