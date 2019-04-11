import React from 'react';
import { Grid } from 'semantic-ui-react';

import TrackListingViewToggleButtons from './TrackListingViewToggleButtons';
import PerPageSelection from './PerPageSelection';

const TrackListingActionRow = ({ page, totalPages, perPage, isLoading }) => {
  if (isLoading) return null;

  return (
    <Grid columns='equal'>
      <Grid.Column textAlign='left'>
        <TrackListingViewToggleButtons />
      </Grid.Column>
      {totalPages * perPage > 25 &&
        <Grid.Column textAlign='right'>
          <PerPageSelection activePage={page} totalPages={totalPages} perPage={perPage} />
        </Grid.Column>
      }
    </Grid>
  );
};

export default TrackListingActionRow;
