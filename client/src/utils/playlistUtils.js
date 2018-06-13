export const getAllPlaylistsTrackCount = playlistList => {
  const keys = Object.keys(playlistList);
  let trackCount = 0;

  if (keys.length === 0 || !keys) {
    return trackCount;
  }

  keys.forEach(item => {
    trackCount = trackCount + (playlistList[item].listOfTracks && playlistList[item].listOfTracks.length);
  })

  return trackCount;
}

export const getPlaylistCount = playlistList => {
  return Object.keys(playlistList).length || 0;
}
