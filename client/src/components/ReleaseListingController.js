import React, { Fragment, useEffect } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Item, Placeholder } from 'semantic-ui-react';
import Scroll from 'react-scroll';

import ResponsiveTrackListing from './ResponsiveTrackListing';
import { fetchReleaseData } from '../thunks';
import { constructLinks } from '../utils/trackUtils';

const ReleaseListingController = ({ match, fetchReleaseData, releaseListing, isLoading }) => {
  useEffect(() => {
    const { releaseId } = match.params;
    fetchReleaseData(releaseId);
    Scroll.animateScroll.scrollToTop({ duration: 1500 });
  }, []);

  return (
    <Fragment>
      <Item.Group>
        <Item>
          {!releaseListing.id ?
            <Placeholder fluid>
              <Placeholder.Image square />
            </Placeholder>
            :
            <Item.Image src={releaseListing.images.large.secureUrl} size='small' />
          }
          {!releaseListing.id ?
            <Placeholder>
              <Placeholder.Header>
                <Placeholder.Line length='very short' />
                <Placeholder.Line length='medium' />
              </Placeholder.Header>
              <Placeholder.Paragraph>
                <Placeholder.Line length='short' />
              </Placeholder.Paragraph>
            </Placeholder>
            :
            <Item.Content verticalAlign='middle' className='releaseHeaderContent'>
              <Item.Header>{releaseListing.name}</Item.Header>
              <Item.Meta>{constructLinks(releaseListing.artists, 'artist')}</Item.Meta>
              <Item.Meta>
                {releaseListing.catalogNumber} [<Link to={`/label/${releaseListing.label.slug}/${releaseListing.label.id}`}>{releaseListing.label.name}</Link>]
                </Item.Meta>
              <Item.Description>{releaseListing.description}</Item.Description>
              <Item.Extra>Released: {releaseListing.releaseDate}</Item.Extra>
            </Item.Content>
          }
        </Item>
      </Item.Group>
      {releaseListing.id ?
        <ResponsiveTrackListing trackListing={releaseListing.tracks} isPlaylist={false} isLoading={isLoading} page={1} perPage={10} />
        :
        null
      }
    </Fragment>
  );
}

const mapStateToProps = (state) => {
  const { isLoading, releaseListing } = state;

  return {
    isLoading: isLoading,
    releaseListing: releaseListing,
  }
}

const mapDispatchToProps = { fetchReleaseData };

export default connect(mapStateToProps, mapDispatchToProps)(ReleaseListingController);
