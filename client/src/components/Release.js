import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Item, Placeholder } from 'semantic-ui-react';
import Scroll from 'react-scroll';

import TrackListingGroup from './TrackListingGroup';
import { fetchReleaseData } from '../thunks';
import { constructLinks } from '../utils/trackUtils';
import { DEFAULT_PAGE_TITLE } from '../constants/defaults';

const Release = ({ match, fetchReleaseData, release, trackListing }) => {
  // TODO: deconstruct release obj
  const { params = {} } = match;
  const { releaseId } = params;
  const {
    id,
    name,
    artists = [],
    label = {},
    images = {},
    catalogNumber,
    description,
    releaseDate,
  } = release;

  useEffect(() => {
    if (releaseId) {
      fetchReleaseData(releaseId);
      Scroll.animateScroll.scrollToTop({ duration: 1500 });
    }
  }, [fetchReleaseData, releaseId]);

  let pageTitle = '';

  if (name) {
    pageTitle = name;

    if (artists.length > 0) {
      // TODO: create a 'stringify' helper fn for artists. this is repeated elsewhere
      let artistsString = artists.reduce(
        (acc, val, idx) => (acc += (idx > 0 ? ', ' : '') + val.name),
        '',
      );
      pageTitle += ' by ' + artistsString;
    }

    pageTitle += ' :: ';
  }

  pageTitle += DEFAULT_PAGE_TITLE;

  return (
    <>
      <Helmet>
        <title>{pageTitle}</title>
      </Helmet>
      <Item.Group>
        <Item>
          {!id ? (
            <Placeholder fluid>
              <Placeholder.Image square />
            </Placeholder>
          ) : (
            <Item.Image
              src={images.large && images.large.secureUrl}
              size='small'
            />
          )}
          {!id ? (
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
              <Item.Header>{name}</Item.Header>
              <Item.Meta>{constructLinks(artists, 'artist')}</Item.Meta>
              <Item.Meta>
                {catalogNumber} [
                <Link to={`/label/${label.slug}/${label.id}`}>
                  {label.name}
                </Link>
                ]
              </Item.Meta>
              <Item.Description>{description}</Item.Description>
              <Item.Extra>Released: {releaseDate}</Item.Extra>
            </Item.Content>
          )}
        </Item>
      </Item.Group>
      {release.id && <TrackListingGroup trackListing={trackListing} />}
    </>
  );
};

const mapStateToProps = (state) => {
  const { isLoading, release, trackListing } = state;

  return {
    isLoading,
    release,
    trackListing,
  };
};

const mapDispatchToProps = { fetchReleaseData };

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Release);
