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
  const key_id = +queryString.parse(search).key_id || '';
  const genre_id = +queryString.parse(search).genre_id || '';
  const per_page = +queryString.parse(search).per_page || '';
  const publishDateStart = +queryString.parse(search).publishDateStart || '';
  const publishDateEnd = +queryString.parse(search).publishDateEnd || '';
  const bpmStart = +queryString.parse(search).bpmStart || '';
  const bpmEnd = +queryString.parse(search).bpmEnd || '';

  const [activeIndex, setActiveIndex] = useState(0);
  const [selectedGenre, setSelectedGenre] = useState(
    +queryString.parse(search).genre_id || '',
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
  const [selectedBpmStart, setSelectedBpmStart] = useState(bpmStart);
  const [selectedBpmEnd, setSelectedBpmEnd] = useState(bpmEnd);

  useEffect(() => {
    setSelectedGenre(genre_id);
    setSelectedMusicalKey(key_id);
    setSelectedPerPage(per_page);
    setSelectedPublishDateStart(publishDateStart);
    setSelectedPublishDateEnd(publishDateEnd);
    setSelectedBpmStart(bpmStart);
    setSelectedBpmEnd(bpmEnd);
  }, [genre_id, key_id, per_page, publishDateStart, publishDateEnd, bpmStart, bpmEnd]);

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

  const handleBPMStartChange = (e, { value }) => {
    setSelectedBpmStart(value);
  };

  const handleBPMEndChange = (e, { value }) => {
    setSelectedBpmEnd(value);
  };

  const handleTimeframeChange = (e, { value }) => {
    const values = queryString.parse(value);
    const { publishDateStart, publishDateEnd } = values;

    setSelectedPublishDateStart(publishDateStart);
    setSelectedPublishDateEnd(publishDateEnd);
  };

  const filterTracks = () => {
    let publish_date, bpm;
    if (selectedPublishDateStart || selectedPublishDateEnd) {
      publish_date = `${selectedPublishDateStart}:${selectedPublishDateEnd}`;
    }
    if (selectedBpmStart || selectedBpmEnd) {
      bpm = `${selectedBpmStart}:${selectedBpmEnd}`;
    }
    
    // use _.pickBy to remove non-filtered options
    history.push(
      `?${queryString.stringify(
        _.pickBy({
          genre_id: selectedGenre.join(','),
          key_id: selectedMusicalKey,
          per_page: selectedPerPage,
          publish_date,
          bpm,
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
    setSelectedBpmStart('');
    setSelectedBpmEnd('');
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
            <Form.Dropdown
              label='GENRE'
              placeholder='House'
              clearable
              fluid
              search
              selection
              multiple
              options={genreOptions}
              onChange={handleGenreChange}
              value={selectedGenre}
              width={4}
            />
            <Form.Input
              type='number'
              fluid
              label='BPM START'
              width={2}
              onChange={handleBPMStartChange}
              value={selectedBpmStart}
            />
            <Form.Input
              type='number'
              fluid
              label='BPM END'
              width={2}
              onChange={handleBPMEndChange}
              value={selectedBpmEnd}
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
              width={2}
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
