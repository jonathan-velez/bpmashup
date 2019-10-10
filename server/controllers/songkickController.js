const axios = require('axios');
const { SONGKICK_API_KEY } = process.env;

// Searches the Songkick API for an artist ID by a search string
async function getArtistId(req, res) {
  const { artistName } = req.query;
  const url = `https://api.songkick.com/api/3.0/search/artists.json?apikey=${SONGKICK_API_KEY}&query=${artistName}`;

  try {
    const response = await axios.get(url);

    if (response.data.resultsPage) {
      res.json(response.data);
    } else {
      res.json({ success: false });
    }
  } catch (error) {
    res.json({ success: false, error });
  }
}

/*
Takes in a search string for an artist, searches Songkick for the artist, takes the first result and extracts
the artist's events URL. Then it will call the events url and return the list of events.

TODO: allow search by artistId in case it is known
*/
async function getUpcomingEvents(req, res) {
  const { artistName } = req.query;
  if (!artistName) {
    res.json({ success: false, error: 'No artist name provided' });
  }

  const url = `https://api.songkick.com/api/3.0/search/artists.json?apikey=${SONGKICK_API_KEY}&query=${artistName}`;
  try {
    const response = await axios.get(url);
    const { data } = response;
    const { resultsPage } = data;
    let events = [];

    if (resultsPage && resultsPage.results && Object.keys(resultsPage.results).length > 0) {
      const { artist } = resultsPage.results;
      if (artist && artist.length === 0) {
        return res.json({ success: true, events });
      }

      const { identifier } = artist[0];
      if (identifier.length === 0) {
        return res.json({ success: true, events });
      }

      const { eventsHref } = identifier[0];
      if (!eventsHref) {
        return res.json({ success: true, events });
      }

      axios.get(`${eventsHref}?apikey=${SONGKICK_API_KEY}`)
        .then(events => {
          return res.json({ success: true, events: events.data.resultsPage.results.event });
        })
        .catch(error => {
          console.log(`Error in calling songkick events api - ${eventsHref}`, error);
          return res.json({ success: false, error });
        });
    } else {
      console.log('No results for this artist search')
      return res.json({ success: false });
    }
  } catch (error) {
    console.log('Error in songkickController.getUpcomingEvents', error)
    return res.json({ success: false, error });
  }
}

exports.getArtistId = getArtistId;
exports.getUpcomingEvents = getUpcomingEvents;
