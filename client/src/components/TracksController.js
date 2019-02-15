import React, { Component, Fragment } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import queryString from 'query-string';
import { withRouter } from 'react-router';
import Scroll from 'react-scroll';
import _ from 'lodash';

import { getTracks } from '../thunks';
import TrackListingGroup from './TrackListingGroup';
import { KeyCamelot } from '../constants/musicalKeys';

import { Dropdown, Button, Grid } from 'semantic-ui-react'

class Tracks extends Component {
  state = {
    selectedGenre: +queryString.parse(this.props.location.search).genre || null,
    selectedMusicalKey: +queryString.parse(this.props.location.search).key || null,
    selectedPerPage: +queryString.parse(this.props.location.search).perPage || null,
  }

  componentDidMount() {
    this.fetchTracks(Object.assign({}, this.parseParams(), queryString.parse(this.props.location.search)));
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      selectedGenre: +queryString.parse(nextProps.location.search).genre || null,
      selectedMusicalKey: +queryString.parse(nextProps.location.search).key || null,
      selectedPerPage: +queryString.parse(nextProps.location.search).perPage || null,
    })
  }

  componentDidUpdate(prevProps) {
    const newSearchParams = queryString.parse(this.props.location.search);
    const prevSearchParams = queryString.parse(prevProps.location.search);

    if (!_.isEqual(prevSearchParams, newSearchParams)) {
      this.fetchTracks(Object.assign({}, this.parseParams(), newSearchParams));
    }
  }

  parseParams() {
    const { itemType, itemId } = this.props.match.params;
    const extraParams = {};

    switch (itemType) {
      case 'artist':
        extraParams.artistId = itemId;
        break;
      case 'label':
        extraParams.labelId = itemId;
        break;
      default:
        break;
    }
    return extraParams;
  }

  fetchTracks(payload) {
    Scroll.animateScroll.scrollToTop({ duration: 1500 });
    this.props.getTracks(payload);
  }

  handleGenreChange = (e, { value }) => {
    this.setState({ selectedGenre: value });
  }

  handleKeyChange = (e, { value }) => {
    this.setState({ selectedMusicalKey: value });
  }

  filterTracks = () => {
    const { selectedGenre: genre, selectedMusicalKey: key, selectedPerPage: perPage } = this.state;

    // use _.pickBy to remove non-filtered options
    this.props.history.push(`?${queryString.stringify(_.pickBy({
      genre,
      key,
      perPage,
    }))}`);
  }

  render() {
    const { trackListing, genreListing } = this.props;
    const { selectedGenre, selectedMusicalKey } = this.state;

    const genreOptions = genreListing.map(genre => {
      return (
        {
          ...genre,
          key: genre.id,
          value: +genre.id,
          text: genre.name,
        }
      )
    });

    const keyOptions = Object.values(KeyCamelot).sort((a, b) => a.replace(/\D/g, '') - b.replace(/\D/g, '')).map(musicalKey => {
      return (
        {
          key: _.invert(KeyCamelot)[musicalKey],
          value: +_.invert(KeyCamelot)[musicalKey],
          text: musicalKey,
        }
      )
    });

    return (
      <Fragment>
        <Grid columns={4} textAlign='left'>
          <Grid.Row>
            <Grid.Column>
              <Dropdown
                placeholder='Genres'
                fluid
                search
                selection
                options={genreOptions}
                onChange={this.handleGenreChange}
                value={selectedGenre}
              />
            </Grid.Column>
            <Grid.Column>
              <Dropdown
                placeholder='Key'
                fluid
                search
                selection
                options={keyOptions}
                onChange={this.handleKeyChange}
                value={selectedMusicalKey}
              />
            </Grid.Column>
            <Grid.Column>
              <Button onClick={this.filterTracks}>Filter</Button>
            </Grid.Column>
          </Grid.Row>
        </Grid>
        <TrackListingGroup trackListing={trackListing} />
      </Fragment>
    );
  }
}

const mapStateToProps = state => {
  return {
    trackListing: state.trackListing,
    genreListing: state.genreListing,
  }
}

const mapDispatchToProps = dispatch => {
  return bindActionCreators({ getTracks }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Tracks));
