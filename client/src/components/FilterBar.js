import React, { useState, useEffect } from 'react';
import { Form, Icon, Accordion } from 'semantic-ui-react';
import queryString from 'query-string';
import _ from 'lodash';

import { KeyCamelot } from '../constants/musicalKeys';

const FilterBar = ({ location, history, genreListing }) => {
  const { search } = location;

  const key = +queryString.parse(search).key || '';
  const genre = +queryString.parse(search).genre || '';
  const perPage = +queryString.parse(search).perPage || '';
  const publishDateStart = +queryString.parse(search).publishDateStart || '';
  const publishDateEnd = +queryString.parse(search).publishDateEnd || '';
  const bpm = +queryString.parse(search).bpm || '';

  const [activeIndex, setActiveIndex] = useState(0);
  const [selectedGenre, setSelectedGenre] = useState(+queryString.parse(search).genre || '');
  const [selectedMusicalKey, setSelectedMusicalKey] = useState(+queryString.parse(search).key || '');
  const [selectedPerPage, setSelectedPerPage] = useState(perPage);
  const [selectedPublishDateStart, setSelectedPublishDateStart] = useState(publishDateStart);
  const [selectedPublishDateEnd, setSelectedPublishDateEnd] = useState(publishDateEnd);
  const [selectedBpm, setSelectedBpm] = useState(bpm);


  useEffect(() => {
    setSelectedGenre(genre);
    setSelectedMusicalKey(key);
    setSelectedPerPage(perPage);
    setSelectedPublishDateStart(publishDateStart);
    setSelectedPublishDateEnd(publishDateEnd);
    setSelectedBpm(bpm);
  }, [search]);

  const handleAccordionClick = (e, titleProps) => {
    const { index } = titleProps
    const newIndex = activeIndex === index ? -1 : index

    setActiveIndex(newIndex);
  }

  const handleGenreChange = (e, { value }) => {
    setSelectedGenre(value);
  }

  const handleKeyChange = (e, { value }) => {
    setSelectedMusicalKey(value);
  }

  const handleBPMChange = (e, { value }) => {
    setSelectedBpm(value);
  }

  const handleTimeframeChange = (e, { value }) => {
    const values = queryString.parse(value);
    const { publishDateStart, publishDateEnd } = values;

    setSelectedPublishDateStart(publishDateStart);
    setSelectedPublishDateEnd(publishDateEnd);
  }

  const filterTracks = () => {
    // use _.pickBy to remove non-filtered options
    history.push(`?${queryString.stringify(_.pickBy({
      genre: selectedGenre,
      key: selectedMusicalKey,
      perPage: selectedPerPage,
      publishDateStart: selectedPublishDateStart,
      publishDateEnd: selectedPublishDateEnd,
      bpm: selectedBpm,
    }))}`);
  }

  const clearFilters = () => {
    setSelectedGenre('');
    setSelectedMusicalKey('');
    setSelectedPerPage('');
    setSelectedPublishDateStart('');
    setSelectedPublishDateEnd('');
    setSelectedBpm('');
  }


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
              options={keyOptions}
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
            <Form.Button label='GO' color='red' onClick={filterTracks}><Icon name='filter' />Filter</Form.Button>
            <Form.Button basic label='CLEAR' onClick={clearFilters}><Icon name='delete' />Clear</Form.Button>
          </Form.Group>
        </Form>
      </Accordion.Content>
    </Accordion>
  );

}

export default FilterBar;
