import React, { Component } from 'react';
import { Form, Icon, Accordion } from 'semantic-ui-react';
import queryString from 'query-string';
import _ from 'lodash';

import { KeyCamelot } from '../constants/musicalKeys';

class FilterBar extends Component {
  state = {
    activeIndex: 0,
    selectedGenre: +queryString.parse(this.props.location.search).genre || '',
    selectedMusicalKey: +queryString.parse(this.props.location.search).key || '',
    selectedPerPage: +queryString.parse(this.props.location.search).perPage || '',
    selectedPublishDateStart: +queryString.parse(this.props.location.search).publishDateStart || '',
    selectedPublishDateEnd: +queryString.parse(this.props.location.search).publishDateEnd || '',
    selectedBPM: +queryString.parse(this.props.location.search).bpm || '',
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.location.search === this.props.location.search) {
      return;
    }

    this.setState({
      selectedGenre: +queryString.parse(nextProps.location.search).genre || '',
      selectedMusicalKey: +queryString.parse(nextProps.location.search).key || '',
      selectedPerPage: +queryString.parse(nextProps.location.search).perPage || '',
      selectedPublishDateStart: queryString.parse(nextProps.location.search).publishDateStart || '',
      selectedPublishDateEnd: queryString.parse(nextProps.location.search).publishDateEnd || '',
      selectedBPM: +queryString.parse(nextProps.location.search).bpm || '',
    })
  }

  handleAccordionClick = (e, titleProps) => {
    const { index } = titleProps
    const { activeIndex } = this.state
    const newIndex = activeIndex === index ? -1 : index

    this.setState({ activeIndex: newIndex })
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

  clearFilters = () => {
    this.setState({
      selectedGenre: '',
      selectedMusicalKey: '',
      selectedPerPage: '',
      selectedPublishDateStart: '',
      selectedPublishDateEnd: '',
      selectedBPM: '',
    });
  }

  render() {
    const { activeIndex, selectedGenre, selectedMusicalKey, selectedPublishDateStart, selectedPublishDateEnd, selectedBPM } = this.state;
    const { genreListing } = this.props;

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
      <Accordion fluid>
        <Accordion.Title
          active={activeIndex === 0}
          index={0}
          onClick={this.handleAccordionClick}
          style={{ textAlign: 'left' }}
        >
          <Icon name='dropdown' />
          <Icon name='filter' />
          FILTERS
        </Accordion.Title>
        <Accordion.Content active={activeIndex === 0}>
          <Form>
            <Form.Group style={{ textAlign: 'left' }}>
              <Form.Select
                label='GENRE'
                placeholder='House'
                clearable
                fluid
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
                label='KEY'
                placeholder='11A'
                clearable
                fluid
                selection
                options={keyOptions}
                onChange={this.handleKeyChange}
                value={selectedMusicalKey}
                width={2}
              />
              <Form.Select
                label='TIMEFRAME'
                placeholder='All time'
                clearable
                fluid
                selection
                options={timeframeOptions}
                onChange={this.handleTimeframeChange}
                value={selectedTimeframe}
                width={3}
              />
              <Form.Button label='GO' color='red' onClick={this.filterTracks}><Icon name='filter' />Filter</Form.Button>
              <Form.Button basic label='CLEAR' onClick={this.clearFilters}><Icon name='delete' />Clear</Form.Button>
            </Form.Group>
          </Form>
        </Accordion.Content>
      </Accordion>
    );
  }
}

export default FilterBar;
