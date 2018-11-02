import React from 'react';
import { Link } from 'react-router-dom';
import { Popup, Grid, Icon, Menu } from 'semantic-ui-react';
import _ from 'lodash';

import { transposeArray } from '../utils/helpers';

class GenreList extends React.Component {
  state = {
    popupOpen: false,
    numOfColumns: 3,
  }

  closePopup = () => {
    this.setState({ popupOpen: false });
  }

  openPopup = () => {
    this.setState({ popupOpen: true });
  }

  render() {
    const { genres } = this.props;
    const { popupOpen, numOfColumns } = this.state;
    let gridList = null;

    if (Array.isArray(genres) && genres.length > 0) {
      const transposedGenres = transposeArray(genres, 4);

      let rowLength = null;

      gridList = _.map(transposedGenres, (genreRow, idx) => {
        if (idx == 0) {
          rowLength = genreRow.length;
        }

        let columnsMade = 0;

        return (
          <Grid.Row className='genre-row' columns={rowLength}>
            {genreRow.map(genre => {
              const { name, id, slug } = genre;
              const genreUrl = `/most-popular/genre/${slug}/${id}/`;
              columnsMade++;

              return (
                <Grid.Column
                  key={id}
                  as={Link}
                  to={genreUrl}
                  onClick={this.closePopup}
                  textAlign='center'
                  verticalAlign='middle'
                >
                  {name.toUpperCase()}
                </Grid.Column>
              )
            }
            )}
            {// if there's an extra column to fill, fill it with a blank for alignment
              columnsMade != rowLength ?
                <Grid.Column as="a">&nbsp;</Grid.Column> : null}
          </Grid.Row>
        )
      }
      );
    }

    return (
      <React.Fragment>
        <Popup
          trigger={<Menu.Item>Genres<Icon name='dropdown' /></Menu.Item>}
          position='bottom left'
          wide='very'
          on='click'
          open={popupOpen}
          onClose={this.closePopup}
          onOpen={this.openPopup}
          basic
          verticalOffset={-10}
          size='small'
          hideOnScroll
          flowing
          className='genre-popup'
        >
          <Grid
            centered
            columns={genres.length % numOfColumns > 0 ? numOfColumns + 1 : numOfColumns}
            textAlign='center'
            padded
            stackable
          >
            {gridList}
          </Grid>
        </Popup>
      </React.Fragment>
    )
  }
}

export default GenreList;