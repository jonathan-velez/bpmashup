import React, { useEffect, useState, useRef } from 'react';
import { Helmet } from 'react-helmet';
import { connect } from 'react-redux';
import {
  Checkbox,
  Container,
  Grid,
  Pagination,
  Select,
  Input,
  Icon,
  Dropdown,
} from 'semantic-ui-react';

import DownloadQueueTable from './DownloadQueueTable';
import TitleHeader from './TitleHeader';
import { updateTrackStatus } from '../thunks';
import { fileExistsOnDownloadServer } from '../utils/trackUtils';
import { generateActivityMessage } from '../utils/storeUtils';
import {
  setDownloadQueueSettings,
  getDownloadQueueSettings,
  musicalKeyFilter,
} from '../utils/helpers';
import { getAllDownloadQueueItems, getGenresDropdownArray } from '../selectors';
import { DEFAULT_PAGE_TITLE } from '../constants/defaults';
import { camelotMusicalKeysDropdownArray } from '../constants/musicalKeys';

const DownloadQueuePage = ({ updateTrackStatus, queueItems, genres }) => {
  // TODO: switch to firebase preferences once we build them out
  // const { downloadQueueDefaultSortBy = {} } = userPreferences;

  // load preferences from sessionStorage
  // TODO: Decide if this is stupid to do. Why not just use redux or firebase?
  const downloadQueueSettings = getDownloadQueueSettings();
  const {
    hideFailed: hideFailedStoredSetting = false,
    limitPerPage: limitPerPageStoredSettng = 10,
    showArchiveItems: showArchiveItemsStoredSetting = false,
    sortBy: sortByStoredSetting = 'newest',
  } = downloadQueueSettings;

  const [activePage, setActivePage] = useState(1);
  const [limitPerPage, setLimitPerPage] = useState(limitPerPageStoredSettng);
  const [currentItems, setCurrentItems] = useState([]);
  const [currentItemsPaginated, setCurrentItemsPaginated] = useState([]);
  const [showArchiveItems, setShowArchiveItems] = useState(
    showArchiveItemsStoredSetting,
  );
  const [hideFailed, setHideFailed] = useState(hideFailedStoredSetting);
  const [sortBy, setSortBy] = useState(sortByStoredSetting);
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [selectedMusicalKeys, setSelectedMusicalKeys] = useState([]);
  const [bpmStart, setBpmStart] = useState('');
  const [bpmEnd, setBpmEnd] = useState('');
  const [showYouTubeOnly, setShowYouTubeOnly] = useState(false);

  const [searchString, setSearchString] = useState('');
  const inputRef = useRef(null);

  const sortByOptions = [
    {
      key: 'newest',
      text: 'Newest',
      value: 'newest',
    },
    {
      key: 'oldest',
      text: 'Oldest',
      value: 'oldest',
    },
    {
      key: 'status',
      text: 'Status',
      value: 'status',
    },
  ];

  const tracksPerPageOptions = [
    {
      key: '10',
      text: '10',
      value: 10,
    },
    {
      key: '25',
      text: '25',
      value: 25,
    },
    {
      key: '50',
      text: '50',
      value: 50,
    },
  ];

  useEffect(() => {
    let items = queueItems;

    switch (sortBy) {
      case 'status':
        items.sort((a, b) => {
          const statusA = a.status.toUpperCase();
          const statusB = b.status.toUpperCase();

          if (statusA < statusB) {
            return -1;
          }
          if (statusA > statusB) {
            return 1;
          }

          return 0;
        });
        break;
      case 'oldest':
        items.sort((a, b) => a.addedDate - b.addedDate);
        break;
      case 'newest':
      default:
        items.sort((a, b) => b.addedDate - a.addedDate);
    }

    if (!showArchiveItems) {
      items = items.filter(
        (item) => item.status !== 'downloaded' && item.status !== 'purchased',
      );
    }

    if (hideFailed) {
      items = items.filter((item) => item.status !== 'notAvailable');
    }

    // filter search terms - artists, track or label
    if (searchString) {
      items = items.filter((item) => {
        const { searchTerms, track } = item;

        let { artists, name } = searchTerms;
        artists = artists.toLowerCase();
        name = name.toLowerCase();

        const { label = {} } = track;

        return (
          artists.includes(searchString) ||
          name.includes(searchString) ||
          label.slug.includes(searchString)
        );
      });
    }

    // filter genres
    if (selectedGenres.length > 0) {
      items = items.filter((item) => {
        const { track = {} } = item;
        const { genres = [] } = track;
        const { id } = genres[0];
        return selectedGenres.includes(id);
      });
    }

    // filter musical keys
    if (selectedMusicalKeys.length > 0) {
      items = items.filter((item) => {
        const { track = {} } = item;
        const { key: musicalKey = {} } = track;
        const camelotKey = musicalKeyFilter(musicalKey && musicalKey.shortName);

        let musicalKeyId = '';
        if (camelotKey) {
          const filteredMusicalKey = camelotMusicalKeysDropdownArray.filter(
            (val) => val.text === camelotKey,
          );

          if (filteredMusicalKey.length > 0) {
            musicalKeyId = filteredMusicalKey[0].value;
          }
        }
        return selectedMusicalKeys.includes(musicalKeyId);
      });
    }

    // filter bpm range
    if (bpmStart) {
      items = items.filter((item) => {
        const { track = {} } = item;
        const { bpm } = track;

        return bpm >= +bpmStart;
      });
    }
    if (bpmEnd) {
      items = items.filter((item) => {
        const { track = {} } = item;
        const { bpm } = track;

        return bpm <= +bpmEnd;
      });
    }

    // show YouTube only
    if (showYouTubeOnly) {
      items = items.filter((item) => item.isYouTube);
    }

    setCurrentItems(items);
    setCurrentItemsPaginated(items.slice(0, limitPerPage));
    setActivePage(1);
  }, [
    queueItems,
    genres,
    showArchiveItems,
    hideFailed,
    limitPerPage,
    sortBy,
    searchString,
    selectedGenres,
    selectedMusicalKeys,
    bpmStart,
    bpmEnd,
    showYouTubeOnly,
  ]);

  const handleDownloadClick = async (url, fileName, queueId) => {
    // check if file still exists on server. Due to Heroku Dyno's ephemeral file system, file existence is not guaranteed
    // if it doesn't, re-initiate for processing in download queue

    const fileExists = await fileExistsOnDownloadServer(fileName);
    if (fileExists) {
      const downloadWindow = window.open('/downloadLink.html', '_blank');
      downloadWindow.location = url;
      updateTrackStatus(queueId, 'downloaded');
    } else {
      updateTrackStatus(queueId, 'initiated'); // TODO: set update date, since this is a re-do
      generateActivityMessage(
        'File not found on server, re-initiating download',
      );
    }
  };

  const retryDownload = (queueId) => {
    updateTrackStatus(queueId, 'initiated'); // TODO: set update date and retry tally. consider throttling/limiting requests
    generateActivityMessage('Track re-initiated for processing.');
  };

  const markTrackAsPurchased = (queueId) => {
    updateTrackStatus(queueId, 'purchased');
    generateActivityMessage('Track marked as purchased.');
  };

  const handlePageChange = (e, data) => {
    const start = data.activePage * limitPerPage - limitPerPage;
    const end = start + limitPerPage;

    setActivePage(data.activePage);
    setCurrentItemsPaginated(currentItems.slice(start, end));
  };

  const handleArchiveToggle = (e, data) => {
    const { checked } = data;
    setShowArchiveItems(checked);
    setDownloadQueueSettings({ showArchiveItems: checked });
  };

  const handleHideFailed = (e, data) => {
    const { checked } = data;
    setHideFailed(checked);
    setDownloadQueueSettings({ hideFailed: checked });
  };

  const handleSetLimitPerPage = (e, data) => {
    const { value } = data;
    setLimitPerPage(value);
    setDownloadQueueSettings({ limitPerPage: value });
  };

  const handleSetSortBy = (e, data) => {
    const { value } = data;
    setSortBy(value);
    setDownloadQueueSettings({ sortBy: value });
  };

  const handleSearchInput = ({ target }) => {
    setSearchString(target.value && target.value.toLowerCase());
  };

  const handleGenresChange = (val) => {
    const { value: genres } = val;
    setSelectedGenres(genres);
  };

  const handleMusicalKeyChange = (val) => {
    const { value: musicalKeys } = val;
    setSelectedMusicalKeys(musicalKeys);
  };

  const handleBpmStartChange = (data) => {
    const { value } = data;
    setBpmStart(value);
  };

  const handleBpmEndChange = (data) => {
    const { value } = data;
    setBpmEnd(value);
  };

  const handleToggleYouTubeOnly = (data) => {
    const { checked } = data;
    setShowYouTubeOnly(checked);
  };

  const pageHeader = 'Download Queue';

  return (
    <>
      <Helmet>
        <title>
          {pageHeader} :: {DEFAULT_PAGE_TITLE}
        </title>
      </Helmet>
      <TitleHeader headerTitle={pageHeader} />
      <Container>
        <Grid columns={6} verticalAlign='middle'>
          {/* TODO: refactor into a filter bar component */}
          <Grid.Row>
            <Grid.Column floated='right'>
              <Input
                ref={inputRef}
                size='small'
                onChange={(e) => handleSearchInput(e)}
                iconPosition='left'
                placeholder='Artists, Title, Label'
              >
                <Icon name='search' />
                <input />
              </Input>
            </Grid.Column>
            <Grid.Column floated='right'>
              <Checkbox
                toggle
                label='DL/Purchased'
                onChange={handleArchiveToggle}
                checked={showArchiveItems}
              />
            </Grid.Column>
            <Grid.Column floated='right'>
              <Checkbox
                toggle
                label='Hide Failed'
                onChange={handleHideFailed}
                checked={hideFailed}
              />
            </Grid.Column>
            <Grid.Column floated='right'>
              <Checkbox
                toggle
                label='YouTube Only'
                onChange={(e, data) => handleToggleYouTubeOnly(data)}
                checked={showYouTubeOnly}
              />
            </Grid.Column>
            <Grid.Column textAlign='right' floated='right'>
              <label style={{ paddingRight: '10px' }}>Per page</label>
              <Select
                label='Tracks per page'
                selection
                compact
                options={tracksPerPageOptions}
                value={limitPerPage}
                onChange={(e, data) => handleSetLimitPerPage(e, data)}
              />
            </Grid.Column>
            <Grid.Column textAlign='right' floated='right'>
              <Select
                icon='sort'
                compact
                selection
                options={sortByOptions}
                value={sortBy}
                onChange={(e, data) => handleSetSortBy(e, data)}
              />
            </Grid.Column>
          </Grid.Row>
          <Grid.Row columns={4}>
            <Grid.Column>
              <Dropdown
                placeholder='Genres'
                fluid
                multiple
                search
                selection
                options={genres}
                onChange={(e, val) => handleGenresChange(val)}
              />
            </Grid.Column>
            <Grid.Column>
              <Dropdown
                placeholder='Keys'
                fluid
                multiple
                search
                selection
                options={camelotMusicalKeysDropdownArray}
                onChange={(e, val) => handleMusicalKeyChange(val)}
              />
            </Grid.Column>
            <Grid.Column>
              <Input
                type='number'
                fluid
                label='BPM Start'
                placeholder='120'
                width={2}
                onChange={(e, data) => handleBpmStartChange(data)}
                value={bpmStart}
              />
            </Grid.Column>
            <Grid.Column>
              <Input
                type='number'
                fluid
                label='BPM End'
                placeholder='135'
                width={2}
                onChange={(e, data) => handleBpmEndChange(data)}
                value={bpmEnd}
              />
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Container>
      <DownloadQueueTable
        queue={currentItemsPaginated}
        downloadTrack={handleDownloadClick}
        retryDownload={retryDownload}
        markTrackAsPurchased={markTrackAsPurchased}
      />
      <Grid>
        <Grid.Row columns={2}>
          <Grid.Column floated='left' textAlign='left' verticalAlign='middle'>
            {`${currentItems.length} tracks`}
          </Grid.Column>
          <Grid.Column floated='right' textAlign='right' verticalAlign='middle'>
            <Pagination
              onPageChange={(e, data) => handlePageChange(e, data)}
              totalPages={Math.ceil(currentItems.length / limitPerPage)}
              activePage={activePage}
            />
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </>
  );
};

const mapStateToProps = (state) => {
  const { userDetail } = state;
  const { preferences } = userDetail;

  return {
    queueItems: getAllDownloadQueueItems(state),
    userPreferences: preferences,
    genres: getGenresDropdownArray(state),
  };
};

const mapDispatchToProps = {
  updateTrackStatus,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(DownloadQueuePage);
