import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Form, Icon, Accordion } from 'semantic-ui-react';
import queryString from 'query-string';
import _ from 'lodash';
import moment from 'moment';

import { camelotMusicalKeysDropdownArray } from '../constants/musicalKeys';

const FilterBar = ({ location, history, genreListing }) => {
  const { search } = location;
  const key = +queryString.parse(search).key || '';
  const genre = +queryString.parse(search).genre || '';
  const per_page = +queryString.parse(search).per_page || '';
  const publishDateStart = +queryString.parse(search).publishDateStart || '';
  const publishDateEnd = +queryString.parse(search).publishDateEnd || '';
  const bpm = +queryString.parse(search).bpm || '';

  const [activeIndex, setActiveIndex] = useState(0);
  const [selectedGenre, setSelectedGenre] = useState(
    +queryString.parse(search).genre || '',
  );
  const [selectedMusicalKey, setSelectedMusicalKey] = useState(
    +queryString.parse(search).key || '',
  );
  const [selectedPerPage, setSelectedPerPage] = useState(per_page);
  const [selectedPublishDateStart, setSelectedPublishDateStart] = useState(
    publishDateStart,
  );
  const [selectedPublishDateEnd, setSelectedPublishDateEnd] = useState(
    publishDateEnd,
  );
  const [selectedBpm, setSelectedBpm] = useState(bpm);

  useEffect(() => {
    setSelectedGenre(genre);
    setSelectedMusicalKey(key);
    setSelectedPerPage(per_page);
    setSelectedPublishDateStart(publishDateStart);
    setSelectedPublishDateEnd(publishDateEnd);
    setSelectedBpm(bpm);
  }, [genre, key, per_page, publishDateStart, publishDateEnd, bpm]);

  const handleAccordionClick = (e, titleProps) => {
    const { index } = titleProps;
    const newIndex = activeIndex === index ? -1 : index;

    setActiveIndex(newIndex);
  };

  const handleGenreChange = (e, { value }) => {
    setSelectedGenre(value);
  };

  const handleKeyChange = (e, { value }) => {
    setSelectedMusicalKey(value);
  };

  const handleBPMChange = (e, { value }) => {
    setSelectedBpm(value);
  };

  const handleTimeframeChange = (e, { value }) => {
    const values = queryString.parse(value);
    const { publishDateStart, publishDateEnd } = values;

    setSelectedPublishDateStart(publishDateStart);
    setSelectedPublishDateEnd(publishDateEnd);
  };

  const filterTracks = () => {
    // use _.pickBy to remove non-filtered options
    history.push(
      `?${queryString.stringify(
        _.pickBy({
          genre: selectedGenre,
          key: selectedMusicalKey,
          per_page: selectedPerPage,
          publishDateStart: selectedPublishDateStart,
          publishDateEnd: selectedPublishDateEnd,
          bpm: selectedBpm,
        }),
      )}`,
    );
  };

  const clearFilters = () => {
    setSelectedGenre('');
    setSelectedMusicalKey('');
    setSelectedPerPage('');
    setSelectedPublishDateStart('');
    setSelectedPublishDateEnd('');
    setSelectedBpm('');
  };

  const genreOptions = genreListing.map((genre) => {
    return {
      ...genre,
      key: genre.id,
      value: +genre.id,
      text: genre.name,
    };
  });

  const today = moment().format('YYYY-MM-DD');
  const yesterday = moment()
    .subtract(1, 'day')
    .format('YYYY-MM-DD');
  const weekAgo = moment()
    .subtract(1, 'week')
    .format('YYYY-MM-DD');
  const monthAgo = moment()
    .subtract(1, 'month')
    .format('YYYY-MM-DD');
  const yearAgo = moment()
    .subtract(1, 'year')
    .format('YYYY-MM-DD');

  const timeframeOptions = [
    {
      key: 'today',
      value: `publishDateStart=${today}&publishDateEnd=${today}`,
      text: 'Today',
    },
    {
      key: 'yesterday',
      value: `publishDateStart=${yesterday}&publishDateEnd=${today}`,
      text: 'Yesterday',
    },
    {
      key: 'weekToDate',
      value: `publishDateStart=${weekAgo}&publishDateEnd=${today}`,
      text: 'Past Week',
    },
    {
      key: 'monthToDate',
      value: `publishDateStart=${monthAgo}&publishDateEnd=${today}`,
      text: 'Past Month',
    },
    {
      key: 'yearToDate',
      value: `publishDateStart=${yearAgo}&publishDateEnd=${today}`,
      text: 'Past Year',
    },
  ];

  const selectedTimeframe =
    selectedPublishDateStart &&
    selectedPublishDateEnd &&
    `publishDateStart=${selectedPublishDateStart}&publishDateEnd=${selectedPublishDateEnd}`;

  return (
    <Accordion fluid>
      <Accordion.Title
        active={activeIndex === 0}
        index={0}
        onClick={handleAccordionClick}
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
              onChange={handleGenreChange}
              value={selectedGenre}
              width={4}
            />
            <Form.Input
              type='number'
              fluid
              label='BPM'
              placeholder='128'
              width={2}
              onChange={handleBPMChange}
              value={selectedBpm}
            />
            <Form.Select
              label='KEY'
              placeholder='11A'
              clearable
              fluid
              selection
              options={camelotMusicalKeysDropdownArray}
              onChange={handleKeyChange}
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
              onChange={handleTimeframeChange}
              value={selectedTimeframe}
              width={3}
            />
            <Form.Button label='GO' color='red' onClick={filterTracks}>
              <Icon name='filter' />
              Filter
            </Form.Button>
            <Form.Button basic label='CLEAR' onClick={clearFilters}>
              <Icon name='delete' />
              Clear
            </Form.Button>
          </Form.Group>
        </Form>
      </Accordion.Content>
    </Accordion>
  );
};

const mapStateToProps = (state) => {
  return {
    genreListing: state.genreListing,
  };
};

export default connect(
  mapStateToProps,
  {},
)(withRouter(FilterBar));
