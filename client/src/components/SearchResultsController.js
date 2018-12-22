import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Grid, Card, Image, Header } from 'semantic-ui-react';
import Scroll from 'react-scroll';

// TODO: Clean this shit up
import * as actionCreators from '../actions/ActionCreators';
import * as thunks from '../thunks';
import TrackListingTable from './TrackListingTable';

class SearchResultsController extends Component {
  componentDidMount() {
    const { match, startAsync, searchEverything } = this.props;
    const { searchTerm } = match.params;

    Scroll.animateScroll.scrollToTop({ duration: 1500 });
    startAsync();
    searchEverything(searchTerm);
  }

  componentWillReceiveProps(nextProps) {
    const { isLoading, match, startAsync, searchEverything } = this.props;
    const { searchTerm: nextSearchTerm } = nextProps.match.params;
    const { searchTerm: thisSearchTerm } = match.params;

    if ((nextSearchTerm && nextSearchTerm !== thisSearchTerm) && !isLoading) {
      Scroll.animateScroll.scrollToTop({ duration: 1500 });
      startAsync();
      searchEverything(nextSearchTerm);
    }
  }

  render() {
    const { isLoading, searchResults } = this.props;
    const { artists, tracks, releases, labels } = searchResults;

    if (isLoading) return null;

    const artistsRow = Array.isArray(artists) && artists.map(artist => {
      return (
        <Card key={artist.id}>
          <Card.Content>
            <Link to={`/most-popular/artist/${artist.slug}/${artist.id}`}>
              <Image src={artist.images.large.secureUrl} />
            </Link>
          </Card.Content>
          <Card.Content>
            <Link to={`/most-popular/artist/${artist.slug}/${artist.id}`}>{artist.name}</Link>
          </Card.Content>
        </Card>
      )
    })

    const labelsRow = Array.isArray(labels) && labels.map(label => {
      return (
        <Card key={label.id}>
          <Card.Content>
            <Link to={`/most-popular/label/${label.slug}/${label.id}`}>
              <Image src={label.images.large.secureUrl} />
            </Link>
          </Card.Content>
          <Card.Content>
            <Link to={`/most-popular/label/${label.slug}/${label.id}`}>{label.name}</Link>
          </Card.Content>
        </Card>
      )
    })

    const releasesRow = Array.isArray(releases) && releases.splice(0, 10).map(release => {
      return (
        <Card key={release.id}>
          <Card.Content>
            <Image src={release.images.small.secureUrl} />
          </Card.Content>
        </Card>
      )
    })

    return (
      <Grid>
        {artistsRow.length > 0 ?
          <Grid.Row>
            <Grid.Column>
              <Header textAlign='left' dividing>ARTISTS</Header>
              <Card.Group itemsPerRow={4}>
                {artistsRow}
              </Card.Group>
            </Grid.Column>
          </Grid.Row>
          : null
        }
        {labelsRow.length > 0 ?
          <Grid.Row>
            <Grid.Column>
              <Header textAlign='left' dividing>LABELS</Header>
              <Card.Group itemsPerRow={4}>
                {labelsRow}
              </Card.Group>
            </Grid.Column>
          </Grid.Row>
          : null
        }
        {releasesRow.length > 0 ?
          <Grid.Row>
            <Grid.Column>
              <Header textAlign='left' dividing>RELEASES</Header>
              <Card.Group itemsPerRow={10}>
                {releasesRow}
              </Card.Group>
            </Grid.Column>
          </Grid.Row>
          : null
        }
        {tracks.length > 0 ?
          <Grid.Row>
            <Grid.Column>
              <Header textAlign='left' dividing>TRACKS</Header>
              <TrackListingTable trackListing={tracks.slice(0, 10)} isPlaylist={true} isLoading={this.props.isLoading} page={1} perPage={10} />
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
  return bindActionCreators(Object.assign({}, actionCreators, thunks), dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(SearchResultsController);
// TODO: Clean up down here, shouldn't need to bind everything, can call dispatch from within manually