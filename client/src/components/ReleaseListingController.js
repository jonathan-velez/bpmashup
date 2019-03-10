import React, { Component, Fragment } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Item, Placeholder } from 'semantic-ui-react';
import Scroll from 'react-scroll';

import ResponsiveTrackListing from './ResponsiveTrackListing';
import * as actionCreators from '../actions/ActionCreators';
import * as thunks from '../thunks';
import { constructLinks } from '../utils/trackUtils';

class ReleaseListingController extends Component {
  componentDidMount() {
    const { match } = this.props;
    const { releaseId } = match.params;
    this.props.startAsync();
    this.props.fetchReleaseData(releaseId);
    Scroll.animateScroll.scrollToTop({ duration: 1500 });
  }

  render() {
    const { releaseListing, isLoading } = this.props;
    
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
                <Item.Extra>{releaseListing.releaseDate}</Item.Extra>
              </Item.Content>
            }
          </Item>
        </Item.Group>
        {releaseListing.id ?
          <ResponsiveTrackListing trackListing={releaseListing.tracks} isPlaylist={true} isLoading={isLoading} page={1} perPage={10} />
          :
          null
        }
      </Fragment>
    );
  }
}

const mapStateToProps = state => {
  return {
    isLoading: state.isLoading,
    releaseListing: state.releaseListing,
  }
}

const mapDispatchToProps = dispatch => {
  return bindActionCreators(Object.assign({}, actionCreators, thunks), dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(ReleaseListingController);