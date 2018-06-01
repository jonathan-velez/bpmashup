import React from 'react';
import { Link } from 'react-router-dom';
import { Popup, Grid, Icon, Menu } from 'semantic-ui-react';
import _ from 'lodash';

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
    let gridList = '';

    if (Array.isArray(genres) && genres.length > 0) {
      const genreChunked = _.chunk(genres, this.state.numOfColumns);

      gridList = genreChunked.map((chunk, idx) => {
        return (
          <Grid.Row className='genre-row' key={idx} columns={chunk.length}>
            {chunk.map(genre => {              
              const { name, id, slug } = genre;
              const genreUrl = `/most-popular/genre/${slug}/${id}/`;

              return (
                <Grid.Column key={id}><Link to={genreUrl} onClick={this.closePopup}>{name}</Link></Grid.Column>
              )
            })}
          </Grid.Row>
        )
      })
    }

    return (
      <React.Fragment>
        <Popup          
          trigger={<Menu.Item>Genres<Icon name='dropdown' /></Menu.Item>}
          position='bottom center'
          wide='very'
          on='click'
          open={this.state.popupOpen}
          onClose={this.closePopup}
          onOpen={this.openPopup}
          hideOnScroll
        >
          <Grid
            centered
            columns={this.state.numOfColumns}
            textAlign='center'
          >
            {gridList}
          </Grid>
        </Popup>
      </React.Fragment>
    )
  }
}

export default GenreList;