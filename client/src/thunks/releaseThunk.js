import { callAPIorCache } from '../seessionStorageCache';
import {
  GET_RELEASE_DATA,
  LOAD_TRACKS,
  START_ASYNC,
  FETCH_RELEASES,
} from '../constants/actionTypes';
import { API_GET_RELEASES, API_GET_TRACKS } from '../constants/apiPaths';

// For a given releaseId, fetch its metadata and then fetch the tracks within it
// Requires two separate BP API calls
export async function fetchReleaseData(releaseId) {
  return async (dispatch) => {
    dispatch({
      type: START_ASYNC,
    });

    const releaseMetadata = await callAPIorCache(
      `${API_GET_RELEASES}?id=${releaseId}&perPage=50`,
    );
    const releaseObject = releaseMetadata.data.results[0];

    const releaseTracks = await callAPIorCache(
      `${API_GET_TRACKS}?releaseId=${releaseId}&perPage=50`,
    );
    releaseObject.tracks = releaseTracks.data.results;

    dispatch({
      type: GET_RELEASE_DATA,
      payload: releaseObject,
    });

    dispatch({
      type: LOAD_TRACKS,
      payload: releaseObject.tracks,
    });
  };
}

// TODO: generalize this for artists, labels, etc., allow sortBy
export async function fetchReleasesByArtistId(artistId) {
  return async (dispatch) => {
    dispatch({
      type: START_ASYNC,
    });

    // TODO: pull in perPage and page for real
    const releaseData = await callAPIorCache(
      `${API_GET_RELEASES}?facets=artistId:${artistId}&perPage=25`,
    );

    let payload = {};

    if (releaseData.status === 200) {
      payload = { ...releaseData.data };
    }

    dispatch({
      type: FETCH_RELEASES,
      payload,
    });
  };
}
