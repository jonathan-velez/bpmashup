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

  componentWillReceiveProps(nextProps) {
    if (_.isEqual(this.props, nextProps)) return;
    const { location, lovedLabelsDetails = {} } = this.props;
    const { lovedLabels = [], location: nextLocation, isLoading } = nextProps;
    const { labels } = lovedLabelsDetails;

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

    if (((Object.keys(labels).length === 0 && lovedLabels.length > 0) || // if label details weren't loaded on mount. usually due to firebase not loaded yet.
      (thisPage !== newPage || thisPerPage !== newPerPage)) && // if pagination or per page changes
      !isLoading) { // ensure there's not already an xhr in progress
      this.fetchMyFavoriteLabels(lovedLabels, newPage, newPerPage);
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
