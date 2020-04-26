import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Grid, Header } from 'semantic-ui-react';
import { animateScroll } from 'react-scroll';

import { searchEverything } from '../thunks';
import TrackListingGroup from './TrackListingGroup';
import ItemCards from './ItemCards';
import NothingHereMessage from './NothingHereMessage';

const SearchResultsController = ({
  match = {},
  searchEverything,
  searchResults = {},
  trackListing,
}) => {
  const { searchTerm } = match.params;
  const {
    artists = [],
    labels = [],
    releases = [],
    tracks = [],
  } = searchResults;

  useEffect(() => {
    animateScroll.scrollToTop({ duration: 300 });
    searchEverything(searchTerm);
  }, [searchEverything, searchTerm]);

  if (Object.values(searchResults).reduce((a, b) => a + b.length, 0) === 0) {
    return <NothingHereMessage />;
  }

  return (
    <Grid stackable>
      {artists.length > 0 && <ItemCards items={artists} itemType='artist' />}
      {labels.length > 0 && <ItemCards items={labels} itemType='label' />}
      {releases.length > 0 && <ItemCards items={releases} itemType='release' />}
      {tracks.length > 0 && (
        <Grid.Row>
          <Grid.Column>
            <Header textAlign='left' dividing>
              TRACKS
            </Header>
            <TrackListingGroup trackListing={trackListing} />
          </Grid.Column>
        </Grid.Row>
      )}
    </Grid>
  );
};

const mapStateToProps = (state) => {
  const { isLoading, searchResults, trackListing } = state;
  
  return {
    isLoading,
    searchResults,
    trackListing,
  };
};

const mapDispatchToProps = { searchEverything };

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(SearchResultsController);
