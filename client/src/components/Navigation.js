import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Menu } from 'semantic-ui-react';

import GenreControl from './GenreControl';
import PlaylistDropdownControl from './PlaylistDropdownControl';
import SearchTracks from './SearchTracks';
import Auth from './Auth';

const Navigation = props => {
  return (
    <Menu fixed='top' inverted>
      <Container textAlign='center'>
        <Menu.Item header>
          <Link to="/">BPMashup</Link>
        </Menu.Item>
        <Menu.Item>
          <Link to="/about">Aboot</Link>
        </Menu.Item>
        <GenreControl />
        <PlaylistDropdownControl />
        <Menu.Item>
          <SearchTracks />
        </Menu.Item>
        <Auth />
      </Container>
    </Menu>
  )
}

export default Navigation;