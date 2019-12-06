import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import {
  Label,
  Menu,
  Statistic,
  Icon,
  List,
  Container,
} from 'semantic-ui-react';
import { animateScroll } from 'react-scroll';
import { withRouter } from 'react-router-dom';
import { v4 } from 'node-uuid'

import TrackListingTable from './TrackListingTable';
import NothingHereMessage from './NothingHereMessage';
import EditablePlaylistHeader from './EditablePlaylistHeader';
import ClearPlaylist from './ClearPlaylist';
import DeletePlaylist from './DeletePlaylist';

import { loadTracks } from '../actions/ActionCreators';
import { removeFromPlaylist } from '../thunks';
import { getPlaylistGenreCount, getPlaylistTrackCount } from '../selectors';

const PlaylistController = ({
  match = {},
  playlistList = [],
  trackListing,
  playlistTrackCount,
  loadTracks,
  removeFromPlaylist,
  playlistGenreCount,
  isLoading
}) => {
  const playlistId = match.params.playlistId;
  const playlist = playlistList && playlistList[playlistId];

  const [selectedGenreFilters, setSelectedGenreFilters] = useState({});
  const [filteredTrackListing, setFilteredTrackListing] = useState({});

  const selectedGenreFiltersIds = Object.keys(selectedGenreFilters).filter(genreId => selectedGenreFilters[genreId]);

  const { tracks } = Object.keys(filteredTrackListing).length > 0 ? filteredTrackListing : trackListing;

  useEffect(() => {
    if (playlist) {
      const { tracks = {} } = playlist;
      loadTracks(tracks);
      clearGenreFilter();
      animateScroll.scrollToTop({ duration: 300 });
    }
  }, [loadTracks, playlistId, playlist]);

  useEffect(() => {
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

    filterGenres();
  }, [trackListing, selectedGenreFilters]);

  const handleRemoveFromPlaylist = (trackId) => {
    removeFromPlaylist({
      playlistId,
      trackId: trackId,
    });
  }

  const handleSelectGenreFilter = (genreId) => {
    setSelectedGenreFilters({
      ...selectedGenreFilters,
      [genreId]: !selectedGenreFilters[genreId],
    });
  }

  const handleClearGenreFilter = () => {
    clearGenreFilter();
  }

  const clearGenreFilter = () => {
    setFilteredTrackListing({});
    setSelectedGenreFilters({});
  }

  if (!playlist) return <NothingHereMessage />

  return (
    <React.Fragment>
      <EditablePlaylistHeader
        playlistId={playlistId}
        playlistName={playlist.name}
      />
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
      <Container textAlign='left'>
        <List horizontal verticalAlign='middle'>
          <List.Item>
            <ClearPlaylist playlistId={playlistId} />
          </List.Item>
          <List.Item>
            <DeletePlaylist playlistId={playlistId} />
          </List.Item>
        </List>
      </Container>
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
  const { playlistList, trackListing } = state;
  const playlistGenreCount = getPlaylistGenreCount(state, ownProps);
  const playlistTrackCount = getPlaylistTrackCount(state, ownProps);

  return {
    playlistList,
    trackListing,
    playlistGenreCount,
    playlistTrackCount,
  }
}

const mapDispatchToProps = {
  loadTracks,
  removeFromPlaylist,
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(PlaylistController));
