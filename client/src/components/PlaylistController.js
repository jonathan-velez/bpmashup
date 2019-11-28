import React, { useState, useEffect, useRef } from 'react';
import { connect } from 'react-redux';
import {
  Form,
  Input,
  Label,
  Menu,
  Statistic,
  Icon,
} from 'semantic-ui-react';
import { animateScroll } from 'react-scroll';
import { withRouter } from 'react-router-dom';
import { v4 } from 'node-uuid'

import {
  loadTracks,
  openConfirm,
  resetConfirm,
} from '../actions/ActionCreators';
import TrackListingTable from './TrackListingTable';
import PlaylistHeader from './PlaylistHeader';
import NothingHereMessage from './NothingHereMessage';
import {
  removeFromPlaylist,
  clearPlaylist,
  deletePlaylist,
  editPlaylistName
} from '../thunks';
import {
  getPlaylistGenreCount,
  getPlaylistTrackCount,
} from '../selectors';


const PlaylistController = ({ match = {}, playlistList = [], trackListing, playlistTrackCount, loadTracks, confirmModal, resetConfirm, removeFromPlaylist, openConfirm, clearPlaylist, deletePlaylist, editPlaylistName, history, playlistGenreCount, isLoading }) => {
  const playlistId = match.params.playlistId;
  const playlist = playlistList && playlistList[playlistId];

  const [playlistNameEditMode, setPlaylistNameEditMode] = useState(false);
  const [deletePlaylistFlag, setDeletePlaylistFlag] = useState(false);
  const [clearPlaylistFlag, setClearPlaylistFlag] = useState(false);
  const [playlistName, setPlaylistName] = useState('');
  const [selectedGenreFilters, setSelectedGenreFilters] = useState({});
  const [filteredTrackListing, setFilteredTrackListing] = useState({});

  const handleRef = useRef(null);
  const selectedGenreFiltersIds = Object.keys(selectedGenreFilters).filter(genreId => selectedGenreFilters[genreId]);

  useEffect(() => {
    if (playlist) {
      const { tracks, name } = playlist;

      loadTracks(tracks);
      setPlaylistName(name);
      clearGenreFilter();
      animateScroll.scrollToTop({ duration: 300 });
    }
  }, [playlistId]);

  useEffect(() => {
    if (!playlistName && playlist && playlist.tracks) {
      setPlaylistName(playlist.name);
      clearGenreFilter();
      loadTracks(playlist.tracks);
    }
  }, [playlist]);

  useEffect(() => {
    if (playlistNameEditMode) {
      handleRef.current.focus();
    }
  }, [playlistNameEditMode]);

  useEffect(() => {
    filterGenres();
  }, [selectedGenreFilters]);

  useEffect(() => {
    // If confirm modal is closed (i.e. user answers question), execute pending action or clear its flag
    const { confirm, open } = confirmModal;

    if (open) return;

    if (confirm && clearPlaylistFlag) {
      actuallyClearPlaylist();
      resetConfirm();
      return;
    }
    if (confirm && deletePlaylistFlag) {
      actuallyDeletePlaylists();
      resetConfirm();
      return;
    }
    if (!confirm) {
      if (deletePlaylistFlag) {
        setDeletePlaylistFlag(false);
      }
      if (clearPlaylistFlag) {
        setClearPlaylistFlag(false);
      }
    }
  }, [confirmModal.open]);

  useEffect(() => {
    if (!playlist) return;
    loadTracks(playlist.tracks);
  }, [playlistTrackCount]);


  const validatePlaylistName = (playlistName) => {
    return playlistName.length < 51;
  }

  const handleRemoveFromPlaylist = (trackId) => {
    removeFromPlaylist({
      playlistId,
      trackId: trackId,
    });
  }

  const handleTogglePlaylistNameEditMode = () => {
    setPlaylistNameEditMode(!playlistNameEditMode);
  }

  const handlePlaylistNameChange = (evt) => {
    const playlistName = evt.target.value;

    if (validatePlaylistName(playlistName)) {
      setPlaylistName(playlistName);
    }
  }

  const handleDeletePlaylist = () => {
    setDeletePlaylistFlag(true);

    openConfirm({
      content: 'Are you sure you want to delete this playlist?',
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
    });
  }

  const actuallyDeletePlaylists = () => {
    if (deletePlaylistFlag) {
      deletePlaylist(playlistId);
      setDeletePlaylistFlag(false);

      history.push(`/`);
    }
  }

  const handleClearPlaylist = () => {
    setClearPlaylistFlag(true);

    openConfirm({
      content: 'Are you sure you want to clear this playlist?',
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
    });
  }

  const actuallyClearPlaylist = () => {
    if (clearPlaylistFlag) {
      clearPlaylist(playlistId);
      setClearPlaylistFlag(false);
    }
  }

  const handleFormSubmit = () => {
    editPlaylistName({
      playlistId,
      newName: playlistName,
    });

    handleTogglePlaylistNameEditMode();
  }

  const handleSelectGenreFilter = (genreId) => {
    setSelectedGenreFilters({
      ...selectedGenreFilters,
      [genreId]: !selectedGenreFilters[genreId],
    });
  }

  const filterGenres = () => {
    const { tracks } = trackListing;
    const selectedGenreFiltersIds = Object.keys(selectedGenreFilters);

    if (selectedGenreFiltersIds.length === 0 || !trackListing) return;

    const selectedGenreFiltersArray = selectedGenreFiltersIds.filter(genre => selectedGenreFilters[genre]);
    if (selectedGenreFiltersArray.length === 0) {
      setFilteredTrackListing({});
      return;
    }

    const newTracks = {};
    const trackIds = Object.keys(tracks);

    trackIds.forEach(trackId => {
      if (Array.isArray(tracks[trackId].genres) && tracks[trackId].genres.some(genre => selectedGenreFiltersArray.includes(genre.id.toString()))) {
        newTracks[trackId] = tracks[trackId];
      }
    })

    const filteredTrackListing = {
      ...trackListing,
      tracks: newTracks,
    }

    setFilteredTrackListing(filteredTrackListing);
  }

  const handleClearGenreFilter = () => {
    clearGenreFilter();
  }

  const clearGenreFilter = () => {
    setFilteredTrackListing({});
    setSelectedGenreFilters({});
  }

  if (!playlist) return <NothingHereMessage />
  const { tracks } = Object.keys(filteredTrackListing).length > 0 ? filteredTrackListing : trackListing;

  return (
    <React.Fragment>
      {playlistNameEditMode ?
        <Form onSubmit={handleFormSubmit} className='playlistEditInput'>
          <Input
            value={playlistName}
            onChange={handlePlaylistNameChange}
            size='massive' //TODO: Style this to be the same as the header
            onBlur={handleFormSubmit}
            ref={handleRef}
            fluid
            transparent
          />
        </Form> :
        <PlaylistHeader
          playlistName={playlist.name}
          editHeader={handleTogglePlaylistNameEditMode}
          deletePlaylist={handleDeletePlaylist}
          clearPlaylist={handleClearPlaylist}
        />
      }
      <Statistic.Group size='mini'>
        <Statistic>
          <Statistic.Value>{playlistTrackCount}</Statistic.Value>
          <Statistic.Label>{`Track${playlistTrackCount > 1 ? 's' : ''}`} </Statistic.Label>
        </Statistic>
        <Statistic>
          <Statistic.Value>{Object.keys(playlistGenreCount).length}</Statistic.Value>
          <Statistic.Label>{`Genre${Object.keys(playlistGenreCount).length > 1 ? 's' : ''}`} </Statistic.Label>
        </Statistic>
      </Statistic.Group>
      <Menu>
        <Menu.Item header>Genres</Menu.Item>
        {playlistGenreCount && Object.keys(playlistGenreCount).map(genreId => {
          const genre = playlistGenreCount[genreId];

          return (
            <Menu.Item
              key={genreId}
              active={selectedGenreFiltersIds.includes(genreId)}
              onClick={() => handleSelectGenreFilter(genreId)}>
              {genre.name}
              <Label
                floating
                size='mini'
                color='black'>
                {genre.count}
              </Label>
            </Menu.Item>
          )
        })}
        {selectedGenreFiltersIds.length > 0 && <Menu.Item as='a' onClick={handleClearGenreFilter}><Icon name='delete' />Clear Filter</Menu.Item>}
      </Menu>
      <TrackListingTable
        key={v4()}
        trackListing={tracks}
        isLoading={isLoading}
        removeFromPlaylist={handleRemoveFromPlaylist}
        isPlaylist
      />
    </React.Fragment>
  )
}

const mapStateToProps = (state, ownProps) => {
  const { playlistList, trackListing, confirmModal } = state;
  const playlistGenreCount = getPlaylistGenreCount(state, ownProps);
  const playlistTrackCount = getPlaylistTrackCount(state, ownProps);

  return {
    playlistList,
    trackListing,
    confirmModal,
    playlistGenreCount,
    playlistTrackCount,
  }
}

const mapDispatchToProps = {
  loadTracks,
  openConfirm,
  removeFromPlaylist,
  clearPlaylist,
  deletePlaylist,
  editPlaylistName,
  resetConfirm
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(PlaylistController));
