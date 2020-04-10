import React, { Fragment, useEffect } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Item, Placeholder } from 'semantic-ui-react';
import Scroll from 'react-scroll';

import ResponsiveTrackListing from './ResponsiveTrackListing';
import { fetchReleaseData } from '../thunks';
import { constructLinks } from '../utils/trackUtils';

const Release = ({ match, fetchReleaseData, release, isLoading }) => {
  const { params = {} } = match;
  const { releaseId } = params;

  useEffect(() => {
    if (releaseId) {
      fetchReleaseData(releaseId);
      Scroll.animateScroll.scrollToTop({ duration: 1500 });
    }
  }, [fetchReleaseData, releaseId]);

  return (
    <Fragment>
      <Item.Group>
        <Item>
          {!release.id ? (
            <Placeholder fluid>
              <Placeholder.Image square />
            </Placeholder>
          ) : (
            <Item.Image src={release.images.large.secureUrl} size='small' />
          )}
          {!release.id ? (
            <Placeholder>
              <Placeholder.Header>
                <Placeholder.Line length='very short' />
                <Placeholder.Line length='medium' />
              </Placeholder.Header>
              <Placeholder.Paragraph>
                <Placeholder.Line length='short' />
              </Placeholder.Paragraph>
            </Placeholder>
          ) : (
            <Item.Content
              verticalAlign='middle'
              className='releaseHeaderContent'
            >
              <Item.Header>{release.name}</Item.Header>
              <Item.Meta>{constructLinks(release.artists, 'artist')}</Item.Meta>
              <Item.Meta>
                {release.catalogNumber} [
                <Link to={`/label/${release.label.slug}/${release.label.id}`}>
                  {release.label.name}
                </Link>
                ]
              </Item.Meta>
              <Item.Description>{release.description}</Item.Description>
              <Item.Extra>Released: {release.releaseDate}</Item.Extra>
            </Item.Content>
          )}
        </Item>
      </Item.Group>
      {release.id ? (
        <ResponsiveTrackListing
          trackListing={release.tracks}
          isPlaylist={false}
          isLoading={isLoading}
          page={1}
          perPage={10}
        />
      ) : null}
    </Fragment>
  );
};

const mapStateToProps = (state) => {
  const { isLoading, release } = state;

  return {
    isLoading: isLoading,
    release: release,
  };
};

const mapDispatchToProps = { fetchReleaseData };

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Release);
