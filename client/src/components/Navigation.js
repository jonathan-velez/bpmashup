import React from 'react';
import { Link } from 'react-router-dom';
import { Menu, Responsive, Icon } from 'semantic-ui-react';
import _ from 'lodash';

import GenreControl from './GenreControl';
import PlaylistDropdownControl from './PlaylistDropdownControl';
import SearchTracks from './SearchTracks';
import Auth from './Auth';
import MobileSearchIcon from './MobileSearchIcon';

import logo from '../static/vinyl-lg.png';
import { DEFAULT_PAGE_TITLE } from '../constants/defaults';

class Navigation extends React.PureComponent {
  state = {
    showSearchBar: false,
  };

  throttleKeyPressFunction = _.throttle(({ key }) => {
    (key === 'Escape' || key === 'Esc') && this.handleHideSearchBar();
  }, 100);

  handleShowSearchBar = () => {
    this.setState({
      showSearchBar: true,
    });

    window.addEventListener('keydown', this.throttleKeyPressFunction);
  };

  handleHideSearchBar = () => {
    this.setState({
      showSearchBar: false,
    });

    window.removeEventListener('keydown', this.throttleKeyPressFunction);
  };

  render() {
    const { showSearchBar } = this.state;
    return (
      <Menu fixed='top' borderless>
        <Menu.Item header>
          <Link to='/'>
            <img src={logo} height='32' width='32' alt={DEFAULT_PAGE_TITLE} />
          </Link>
        </Menu.Item>
        <GenreControl />
        <PlaylistDropdownControl />
        <Menu.Item as={Link} to='/charts/all'>
          CHARTS
        </Menu.Item>
        <Menu.Item as={Link} to='/tracks'>
          TRACKS
        </Menu.Item>
        <Menu.Item as={Link} to='/latest'>
          LATEST
        </Menu.Item>
        <Responsive minWidth={850} as={Menu.Item}>
          <SearchTracks />
        </Responsive>
        <Responsive maxWidth={849} as={Menu.Item}>
          {!showSearchBar && (
            <MobileSearchIcon handleShowSearchBar={this.handleShowSearchBar} />
          )}
        </Responsive>
        {showSearchBar && (
          <div
            style={{
              height: '100vh',
              width: '100vw',
              margin: 0,
              padding: 0,
              background: '#eee',
              position: 'absolute',
              top: 0,
              left: 0,
              zIndex: 999,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <SearchTracks isMobile handleHideSearchBar={this.handleHideSearchBar} />
            <a href='#' style={{ paddingLeft: '1em' }}>
              Close
            </a>
            <Icon
              name='close'
              onClick={this.handleHideSearchBar}
              size='large'
              style={{ cursor: 'pointer' }}
            />
          </div>
        )}
        <Menu.Item position='right'>
          <Auth />
        </Menu.Item>
      </Menu>
    );
  }
}

export default Navigation;
