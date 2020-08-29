const axios = require('axios');
const querystring = require('querystring');

const STATE_VAL = 'biggie';

const SPOTIFY_TOKEN_URL = process.env.SPOTIFY_TOKEN_URL;
const SPOTIFY_AUTH_URL = process.env.SPOTIFY_AUTH_URL;
const SPOTIFY_CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const SPOTIFY_SECRET_CLIENT_ID = process.env.SPOTIFY_SECRET_CLIENT_ID;
const SPOTIFY_REDIRECT_URI = process.env.SPOTIFY_REDIRECT_URI;

exports.authorize = async function (req, res) {
  const reqUrl = `${SPOTIFY_AUTH_URL}/?client_id=${SPOTIFY_CLIENT_ID}&response_type=code&redirect_uri=${SPOTIFY_REDIRECT_URI}&state=${STATE_VAL}&show_dialog=false`;
  console.log('reqUrl', reqUrl);

  const result = await axios.get(reqUrl);
  const { data } = result;

  res.json(reqUrl);
  // res.send(data);
};

exports.authCallback = async function (req, res) {
  const { code, state } = req.query;
  console.log(req.query);

  if (state !== STATE_VAL) {
    res.json({
      success: false,
      error: 'STATE_MISMATCH',
    });
  }

  const postData = {
    grant_type: 'authorization_code',
    code,
    redirect_uri: SPOTIFY_REDIRECT_URI,
    client_id: SPOTIFY_CLIENT_ID,
    client_secret: SPOTIFY_SECRET_CLIENT_ID,
  };

  // res.send('sup');

  // code is good, grab a token

  try {
    const result = await axios.post(
      SPOTIFY_TOKEN_URL,
      querystring.stringify(postData),
      {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    );
    const { data } = result;

    console.log(data);
    const expires = new Date(253402300000000);

    res.cookie('spotify_access_token', data.access_token, {
      expires,
    });
    res.cookie('spotify_refresh_token', data.refresh_token, { expires });
    res.redirect(302, 'http://localhost:3000/spotify-playlists');
  } catch (error) {
    console.log(error);
  }
};

exports.authCallbackJSON = async (req, res) => {
  const { code, state } = req.query;
  console.log('SPOTIFY_REDIRECT_URI', SPOTIFY_REDIRECT_URI);
  console.log(req.query);

   const postData = {
     grant_type: 'authorization_code',
     code,
     redirect_uri: 'http://localhost:3000/spotify-cb.html',
     //  redirect_uri: SPOTIFY_REDIRECT_URI,
     client_id: SPOTIFY_CLIENT_ID,
     client_secret: SPOTIFY_SECRET_CLIENT_ID,
   };

   try {
     const result = await axios.post(
       SPOTIFY_TOKEN_URL,
       querystring.stringify(postData),
       {
         'Content-Type': 'application/x-www-form-urlencoded',
       },
     );
     const { data } = result;
     const{ access_token, refresh_token} = data;

     console.log(data);
     const expires = new Date(253402300000000);
     
     res.cookie('spotify_access_token', access_token, {
       expires,
     });
     res.cookie('spotify_refresh_token', refresh_token, { expires });
     res.json({
       success: true,
       access_token,
       refresh_token,
     })
   } catch (error) {
     console.log(error);
   }
}

exports.refreshToken = async (req, res) => {
  const { spotifyRefreshToken, spotifyToken } = req.query;
  const axiosPOSTConfig = {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization:
        'Basic ' +
        new Buffer(SPOTIFY_CLIENT_ID + ':' + SPOTIFY_SECRET_CLIENT_ID).toString(
          'base64',
        ),
    },
  };

  // var axiosPOSTConfig = {
  //   headers: {
  //     Authorization:
  //       'Basic ' +
  //       new Buffer(
  //         SPOTIFY_CLIENT_ID + ':' + SPOTIFY_SECRET_CLIENT_ID,
  //       ).toString('base64'),
  //   },
  // };

  const refreshData = {
    grant_type: 'refresh_token',
    refresh_token: spotifyRefreshToken,
    client_id: SPOTIFY_CLIENT_ID,
  };

  let result;
  try {
    result = await axios.post(
      SPOTIFY_TOKEN_URL,
      querystring.stringify(refreshData),
      axiosPOSTConfig,
    );
  } catch (error) {
    console.log('error refreshing token', error);
  }

  if (result && result.data) {
    console.log('refresh token data', result.data);
    const { access_token } = result.data;
    // setSpotifyToken(access_token);
    // callback();
    res.json({ accessToken: access_token });
  } else {
    res.send({ accessToken: null });
  }
};
