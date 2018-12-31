import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Grid, Card, Image, Header, Responsive } from 'semantic-ui-react';
import Scroll from 'react-scroll';
import _ from 'lodash';

// TODO: Clean this shit up
import * as actionCreators from '../actions/ActionCreators';
import * as thunks from '../thunks';
import { constructLinks } from '../utils/trackUtils';
import ResponsiveTrackListing from './ResponsiveTrackListing';

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

    if (isLoading || _.isEmpty(searchResults)) return null;

    const artistsRow = Array.isArray(artists) && artists.map(artist => {
      return (
        <Card key={artist.id}>
          <Link to={`/most-popular/artist/${artist.slug}/${artist.id}`}>
            <Image src={artist.images.large.secureUrl} />
          </Link>
          <Card.Content>
            <Card.Header>
              <Link to={`/most-popular/artist/${artist.slug}/${artist.id}`}>{artist.name}</Link>
            </Card.Header>
          </Card.Content>
        </Card>
      )
    })

    const labelsRow = Array.isArray(labels) && labels.map(label => {
      return (
        <Card key={label.id}>
          <Link to={`/most-popular/label/${label.slug}/${label.id}`}>
            <Image src={label.images.large.secureUrl} />
          </Link>
          <Card.Content>
            <Card.Header>
              <Link to={`/most-popular/label/${label.slug}/${label.id}`}>{label.name}</Link>
            </Card.Header>
          </Card.Content>
        </Card>
      )
    })

    const releasesRow = Array.isArray(releases) && releases.map(release => {
      return (
        <Card key={release.id}>
          <Link to={`/release/${release.slug}/${release.id}`}>
            <Image src={release.images.large.secureUrl} />
          </Link>
          <Card.Content>
            <Card.Header>
              <Link to={`/release/${release.slug}/${release.id}`}>{release.name}</Link>
            </Card.Header>
            <Card.Meta>
              {constructLinks(release.artists, 'artist')}
            </Card.Meta>
            <Card.Meta>
              <Link to={`/most-popular/label/${release.label.slug}/${release.label.id}`}>{release.label.name}</Link>
            </Card.Meta>
          </Card.Content>
        </Card>
      )
    })

    return (
      <Grid stackable>
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
              <Card.Group itemsPerRow={4}>
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
              <ResponsiveTrackListing trackListing={tracks} isPlaylist={true} isLoading={isLoading} page={1} perPage={10} />
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