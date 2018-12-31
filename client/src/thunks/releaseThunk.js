import axios from 'axios';
import { GET_RELEASE_DATA, LOAD_TRACKS } from '../constants/actionTypes';
import { API_GET_RELEASES, API_GET_TRACKS } from '../constants/apiPaths';

// For a given releaseId, fetch its metadata and then fetch the tracks within it
// Requires two separate BP API calls
export async function fetchReleaseData(releaseId) {
  return async (dispatch, getState) => {
    const releaseMetadata =  await axios.get(`${API_GET_RELEASES}?id=${releaseId}&perPage=50`);
    const releaseObject = releaseMetadata.data.results[0];

    const releaseTracks = await axios.get(`${API_GET_TRACKS}?releaseId=${releaseId}&perPage=50`);
    releaseObject.tracks = releaseTracks.data.results;

    dispatch({
      type: GET_RELEASE_DATA,
      payload: releaseObject,
    })

    dispatch({
      type: LOAD_TRACKS,
      payload: releaseObject.tracks,
    })
  }
}
