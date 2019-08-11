import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Grid, Header } from 'semantic-ui-react';
import Scroll from 'react-scroll';
import _ from 'lodash';

import { searchEverything } from '../thunks';
import ResponsiveTrackListing from './ResponsiveTrackListing';
import ItemCards from './ItemCards';

class SearchResultsController extends Component {
  componentDidMount() {
    const { match, searchEverything } = this.props;
    const { searchTerm } = match.params;

    Scroll.animateScroll.scrollToTop({ duration: 1500 });
    searchEverything(searchTerm);
  }

  componentWillReceiveProps(nextProps) {
    const { isLoading, match, searchEverything } = this.props;
    const { searchTerm: nextSearchTerm } = nextProps.match.params;
    const { searchTerm: thisSearchTerm } = match.params;

    if ((nextSearchTerm && nextSearchTerm !== thisSearchTerm) && !isLoading) {
      Scroll.animateScroll.scrollToTop({ duration: 1500 });
      searchEverything(nextSearchTerm);
    }
  }

  render() {
    const { isLoading, searchResults } = this.props;
    const { artists, tracks, releases, labels } = searchResults;

    if (isLoading || _.isEmpty(searchResults)) return null;

    return (
      <Grid stackable>
        {artists.length > 0 ?
          <ItemCards items={artists} itemType='artist' />
          : null
        }
        {labels.length > 0 ?
          <ItemCards items={labels} itemType='label' />
          : null
        }
        {releases.length > 0 ?
          <ItemCards items={releases} itemType='release' />
          : null
        }
        {tracks.length > 0 ?
          <Grid.Row>
            <Grid.Column>
              <Header textAlign='left' dividing>TRACKS</Header>
              <ResponsiveTrackListing trackListing={tracks} isPlaylist={false} isLoading={isLoading} page={1} perPage={10} />
            </Grid.Column>
          </Grid.Row>
          : null
        }
      </Grid>
    );
  }
}

const mapStateToProps = state => {
  return {
    isLoading: state.isLoading,
    searchResults: state.searchResults,
  }
}

const mapDispatchToProps = dispatch => {
  return bindActionCreators(Object.assign({}, { searchEverything }), dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(SearchResultsController);
