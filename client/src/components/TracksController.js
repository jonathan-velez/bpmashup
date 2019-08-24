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

import { Form, Icon, Accordion } from 'semantic-ui-react'

class Tracks extends Component {
  state = {
    activeIndex: -1,
    selectedGenre: +queryString.parse(this.props.location.search).genre || '',
    selectedMusicalKey: +queryString.parse(this.props.location.search).key || '',
    selectedPerPage: +queryString.parse(this.props.location.search).perPage || '',
    selectedPublishDateStart: +queryString.parse(this.props.location.search).publishDateStart || '',
    selectedPublishDateEnd: +queryString.parse(this.props.location.search).publishDateEnd || '',
    selectedBPM: +queryString.parse(this.props.location.search).bpm || '',
  }

  componentDidMount() {
    this.fetchTracks(Object.assign({}, this.parseParams(), queryString.parse(this.props.location.search)));
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      selectedGenre: +queryString.parse(nextProps.location.search).genre || '',
      selectedMusicalKey: +queryString.parse(nextProps.location.search).key || '',
      selectedPerPage: +queryString.parse(nextProps.location.search).perPage || '',
      selectedPublishDateStart: queryString.parse(nextProps.location.search).publishDateStart || '',
      selectedPublishDateEnd: queryString.parse(nextProps.location.search).publishDateEnd || '',
      selectedBPM: +queryString.parse(nextProps.location.search).bpm || '',
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

  handleBPMChange = (e, { value }) => {
    this.setState({ selectedBPM: value });
  }

  handleTimeframeChange = (e, { value }) => {
    const values = queryString.parse(value);
    const { publishDateStart, publishDateEnd } = values;

    this.setState({
      selectedPublishDateStart: publishDateStart,
      selectedPublishDateEnd: publishDateEnd,
    });
  }

  handleAccordionClick = (e, titleProps) => {
    const { index } = titleProps
    const { activeIndex } = this.state
    const newIndex = activeIndex === index ? -1 : index

    this.setState({ activeIndex: newIndex })
  }

  filterTracks = () => {
    const { selectedGenre: genre, selectedMusicalKey: key, selectedPerPage: perPage, selectedPublishDateStart: publishDateStart, selectedPublishDateEnd: publishDateEnd, selectedBPM: bpm } = this.state;

    // use _.pickBy to remove non-filtered options
    this.props.history.push(`?${queryString.stringify(_.pickBy({
      genre,
      key,
      perPage,
      publishDateStart,
      publishDateEnd,
      bpm,
    }))}`);
  }

  render() {
    const { trackListing, genreListing } = this.props;
    const { activeIndex, selectedGenre, selectedMusicalKey, selectedPublishDateStart, selectedPublishDateEnd, selectedBPM } = this.state;

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

    const timeframeOptions = [
      {
        key: "today",
        value: "publishDateStart=2019-08-23&publishDateEnd=2019-08-23",
        text: "Today",
      },
      {
        key: "yesterday",
        value: "publishDateStart=2019-08-22&publishDateEnd=2019-08-23",
        text: "Yesterday",
      },
      {
        key: "weekToDate",
        value: "publishDateStart=2019-08-16&publishDateEnd=2019-08-23",
        text: "Past Week",
      },
      {
        key: "monthToDate",
        value: "publishDateStart=2019-07-23&publishDateEnd=2019-08-23",
        text: "Past Month",
      },
      {
        key: "yearToDate",
        value: "publishDateStart=2018-08-23&publishDateEnd=2019-08-23",
        text: "Past Year",
      }
    ];

    const selectedTimeframe = selectedPublishDateStart && selectedPublishDateEnd && `publishDateStart=${selectedPublishDateStart}&publishDateEnd=${selectedPublishDateEnd}`;

    return (
      <Fragment>
        <Accordion fluid>
          <Accordion.Title
            active={activeIndex === 0}
            index={0}
            onClick={this.handleAccordionClick}
            style={{ textAlign: 'left' }}
          >
            <Icon name='dropdown' />
            Filters
        </Accordion.Title>
          <Accordion.Content active={activeIndex === 0}>
            <Form>
              <Form.Group style={{ textAlign: 'left' }}>
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
                  type='number'
                  fluid
                  label='BPM'
                  placeholder='128'
                  width={2}
                  onChange={this.handleBPMChange}
                  value={selectedBPM}
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
                  options={timeframeOptions}
                  onChange={this.handleTimeframeChange}
                  value={selectedTimeframe}
                  width={3}
                />
                <Form.Button label='Go' color='red' onClick={this.filterTracks}><Icon name='filter' />Filter</Form.Button>
              </Form.Group>
            </Form>
          </Accordion.Content>
        </Accordion>
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
