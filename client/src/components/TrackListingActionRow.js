import React from 'react';
import { Grid } from 'semantic-ui-react';

import TrackListingViewToggleButtons from './TrackListingViewToggleButtons';
import TrackListingSelectedItemsActionBar from './TrackListingSelectedItemsActionBar';
import PerPageSelection from './PerPageSelection';

const TrackListingActionRow = ({ page, totalPages, per_page, isLoading }) => {
  if (isLoading) return null;

  return (
    <Grid columns='equal'>
      <Grid.Column textAlign='left'>
        <TrackListingViewToggleButtons />
      </Grid.Column>
      <Grid.Column>
        <TrackListingSelectedItemsActionBar />
      </Grid.Column>
      {totalPages * per_page > 25 && (
        <Grid.Column textAlign='right'>
          <PerPageSelection
            activePage={page}
            totalPages={totalPages}
            per_page={per_page}
          />
        </Grid.Column>
      )}
    </Grid>
  );
};

export default TrackListingActionRow;
