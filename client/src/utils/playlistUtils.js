export const getAllPlaylistsTrackCount = playlistList => {
  const keys = Object.keys(playlistList);
  let trackCount = 0;

  keys.forEach(item => {
    trackCount = trackCount + (playlistList[item].listOfTracks.length);
  })

  return trackCount;
}

export const getPlaylistCount = playlistList => {
  return Object.keys(playlistList).length || 0; 
}