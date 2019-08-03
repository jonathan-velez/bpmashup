import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Menu } from 'semantic-ui-react';

import GenreControl from './GenreControl';
import PlaylistDropdownControl from './PlaylistDropdownControl';
import SearchTracks from './SearchTracks';
import Auth from './Auth';

const Navigation = () => {
  return (
    <Menu fixed='top' inverted borderless>
      <Container textAlign='center'>
        <Menu.Item header>
          <Link to="/">BPMashup</Link>
        </Menu.Item>
        <GenreControl />
        <PlaylistDropdownControl />
        <Menu.Item as={Link} to='/tracks'>
          Tracks
        </Menu.Item>
        <Menu.Item>
          <SearchTracks />
        </Menu.Item>
        <Menu.Item position='right'>
          <Auth />
        </Menu.Item>
      </Container>
    </Menu>
  )
}

export default Navigation;
