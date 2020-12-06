import React from 'react';
import { Helmet } from 'react-helmet';
import { connect } from 'react-redux';
import { Checkbox, Form, Grid, Header, Icon, Popup } from 'semantic-ui-react';
import firebase from 'firebase';

import { getUserId } from '../selectors';
import { DEFAULT_PAGE_TITLE } from '../constants/defaults';

const Preferences = ({ userPreferences, uid }) => {
  const firestore = firebase.firestore();

  const { fallbackYouTube } = userPreferences;

  const handleSetFallbackYouTubeDownload = (e, data) => {
    const { checked } = data;

    // update firestore
    const userRef = firestore.collection('users').doc(uid);
    const userPreferencesRef = userRef.collection('preferences');

    userPreferencesRef.doc('prefs').set(
      {
        fallbackYouTube: checked,
      },
      { merge: true },
    );
  };

  const pageHeader = 'User Preferences';

  return (
    <>
      <Helmet>
        <title>
          {pageHeader} :: {DEFAULT_PAGE_TITLE}
        </title>
      </Helmet>
      <Header size='medium' textAlign='left'>
        {pageHeader}
      </Header>
      <Grid>
        <Grid.Row>
          <Grid.Column width={4}>
            <label>Fallback to YouTube downloads</label>
            <Popup
              trigger={<Icon name='info circle' />}
              content='When enabled, downloads for which the system cannot find a suitable 320 kbps file will be pulled from YouTube. Files will be compressed to 320kbps MP3s, but will be ripped from an already compressed file.'
            />
          </Grid.Column>
          <Grid.Column width={12} textAlign='left'>
            <Checkbox
              toggle
              onChange={handleSetFallbackYouTubeDownload}
              checked={fallbackYouTube}
            />
          </Grid.Column>
        </Grid.Row>
      </Grid>
      <Form>
        <Form.Group>
          <Form.Field inline />
        </Form.Group>
      </Form>
    </>
  );
};

const mapStateToProps = (state) => {
  const { userDetail = {} } = state;
  const { preferences } = userDetail;

  return {
    userPreferences: preferences,
    uid: getUserId(state),
  };
};

export default connect(
  mapStateToProps,
  {},
)(Preferences);
