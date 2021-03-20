import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import firebase from 'firebase';
import { Header, Grid, Statistic } from 'semantic-ui-react';
import _ from 'lodash';

import { updateAdminDownloadQueueActivityData } from '../actions/ActionCreators';

const AdminDownloadQueueController = ({
  arrayData,
  updateAdminDownloadQueueActivityData,
}) => {
  const [downloadQueueItems, setDownloadQueueItems] = useState({});
  const [downloadQueueItemsArray, setDownloadQueueItemsArray] = useState([]);
  const [mostPopularGenre, setMostPopularGenre] = useState({
    downloadCount: 0,
    name: '',
  });
  const [genrePieChartData, setGenrePieChartData] = useState({});
  const [numOfTracksDownloaded, setNumOfTracksDownloaded] = useState(0);
  const [popularityData, setPopularityData] = useState({
    artists: {},
    genres: {},
    tracks: {},
    labels: {},
    users: {},
  });

  useEffect(() => {
    const firestore = firebase.firestore();
    // TODO: Limit this to a 'safe' date range. 7 days?
    // TODO: Look into detecting only the delta
    const downloadQueueRef = firestore.collection('downloadQueue');

    const unregisterListener = downloadQueueRef.onSnapshot((items) => {
      let downloadQueueItems = {};
      let downloadQueueItemsArray = [];

      // update number of total tracks downlaoded
      setNumOfTracksDownloaded(items.size);

      // loop through collection and push items to state
      items.forEach((item) => {
        const details = item.data();

        downloadQueueItems[details.queueId] = details;
        downloadQueueItemsArray.push(details);
      });
      setDownloadQueueItemsArray(downloadQueueItemsArray);
      setDownloadQueueItems(downloadQueueItems);

      console.log('downloadQueueItemsArray', downloadQueueItemsArray);

      updateAdminDownloadQueueActivityData({
        downloadQueueItemsArray,
      });
    });

    return () => unregisterListener();
  }, []);

  useEffect(() => {
    console.log('downloadQueueItemsArray changed!', downloadQueueItemsArray);

    // produce genre popularity breakdown
    const genreBreakDown = downloadQueueItemsArray.reduce((acc, item) => {
      const { track } = item;
      const genre = track.genres && track.genres[0] && track.genres[0].name;

      acc[genre] = (acc[genre] || 0) + 1;
      return acc;
    }, {});
    setGenrePieChartData(genreBreakDown);

    // produce ALL popularity breakdown
    const popularity = downloadQueueItemsArray.reduce(
      (acc, item) => {
        const { track, addedBy, searchTerms } = item;

        // genres
        const genre = track.genres && track.genres[0] && track.genres[0].name;
        acc.genres[genre] = (acc.genres[genre] || 0) + 1;

        // artists
        const artists = track.artists || [];
        artists.forEach((artist) => {
          const { name } = artist;
          acc.artists[name] = (acc.artists[name] || 0) + 1;
        });

        // tracks
        const trackTitle = `${searchTerms.artists} -  ${searchTerms.name} ${
          searchTerms.mix_name && searchTerms.mix_name.trim().length > 0
            ? `(${_.startCase(_.toLower(searchTerms.mix_name))})`
            : ''
        }`;

        // acc.tracks[track.id] = (acc.tracks[track.id] || 0) + 1;
        acc.tracks[trackTitle] = (acc.tracks[trackTitle] || 0) + 1;

        // labels
        acc.labels[track.label && track.label.id] =
          (acc.labels[track.label && track.label.id] || 0) + 1;

        // users
        acc.users[addedBy] = (acc.users[addedBy] || 0) + 1;

        return acc;
      },
      { genres: {}, artists: {}, tracks: {}, labels: {}, users: {} },
    );
    setPopularityData(popularity);

    // produce most popular genre
    const keys = Object.keys(genreBreakDown);
    const mostPopularGenre = keys.reduce(
      (acc, genre) => {
        const cnt = genreBreakDown[genre];
        const { downloadCount } = acc;

        if (cnt > downloadCount) {
          acc.downloadCount = cnt;
          acc.genre = genre;
        }
        return acc;
      },
      { downloadCount: 0, genre: '' },
    );
    setMostPopularGenre(mostPopularGenre);
  }, [downloadQueueItemsArray]);

  return (
    <div>
      <Header>Admin Download Queue</Header>
      <Grid columns={2}>
        <Grid.Column>
          <Statistic>
            <Statistic.Label>Total Tracks Downloaded</Statistic.Label>
            <Statistic.Value>{numOfTracksDownloaded}</Statistic.Value>
          </Statistic>
        </Grid.Column>
        <Grid.Column>
          <Statistic>
            <Statistic.Label>Most Popular Genre</Statistic.Label>
            <Statistic.Value>
              {mostPopularGenre.genre} ({mostPopularGenre.downloadCount})
            </Statistic.Value>
          </Statistic>
        </Grid.Column>
      </Grid>
    </div>
  );
};

const mapStateToProps = (state) => {
  return { arrayData: state.globalDownloadActivity.downloadQueueItemsArray };
};

const mapDispatchToProps = {
  updateAdminDownloadQueueActivityData,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(AdminDownloadQueueController);
