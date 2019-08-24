import React, { Component, Fragment } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import queryString from 'query-string';
import { withRouter } from 'react-router';
import Scroll from 'react-scroll';
import _ from 'lodash';

import { getTracks, clearTracklist } from '../thunks';
import TrackListingGroup from './TrackListingGroup';
import { KeyCamelot } from '../constants/musicalKeys';

import { Form, Icon } from 'semantic-ui-react'

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

  componentWillUnmount() {
    this.props.clearTracklist();
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

    const bpmStyle = {
      textAlign: 'left',
    }

    return (
      <Fragment>
        <Form>
          <Form.Group style={bpmStyle}>
            <Form.Select
              label='Genre'
              placeholder='House'
              clearable
              fluid
              search
              selection
              options={genreOptions}
              onChange={this.handleGenreChange}
              value={selectedGenre}
              width={4}
            />
            <Form.Input
              fluid
              label='BPM from'
              placeholder='120'
              width={2}
            />
            <Form.Input
              fluid
              label='BPM to'
              placeholder='135'
              width={2}
            />
            <Form.Select
              label='Key'
              placeholder='11A'
              clearable
              fluid
              search
              selection
              options={keyOptions}
              onChange={this.handleKeyChange}
              value={selectedMusicalKey}
              width={2}
            />
            <Form.Select
              label='Timeframe'
              placeholder='All time'
              clearable
              fluid
              search
              selection
              options={keyOptions}
              onChange={this.handleKeyChange}
              value={selectedMusicalKey}
              width={3}
            />
            <Form.Button label='Go' color='red'><Icon name='filter' />Filter</Form.Button>
          </Form.Group>
        </Form>
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
  return bindActionCreators({ getTracks, clearTracklist }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Tracks));
