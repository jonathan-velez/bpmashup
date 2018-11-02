import React from 'react';
import { Link } from 'react-router-dom';
import { Popup, Icon, Menu, Table } from 'semantic-ui-react';
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
    const { popupOpen } = this.state;
    let tableList = null;

    if (Array.isArray(genres) && genres.length > 0) {
      const transposedGenres = transposeArray(genres, 4);

      let rowLength = null;

      tableList = _.map(transposedGenres, (genreRow, idx) => {
        if (idx == 0) {
          rowLength = genreRow.length;
        }

        let cellsMade = 0;

        return (
          <Table.Row key={idx}>
            {genreRow.map(genre => {
              const { name, id, slug } = genre;
              const genreUrl = `/most-popular/genre/${slug}/${id}/`;

              cellsMade++;
              return (
                <Table.Cell key={id} onClick={this.closePopup} textAlign='center' selectable>
                  <Link to={genreUrl}>{name.toUpperCase()}</Link>
                </Table.Cell>
              )
            })}
            {cellsMade != rowLength ?
              <Table.Cell>&nbsp;</Table.Cell> : null}
          </Table.Row>
        )
      })
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
          inverted
          size='small'
          hideOnScroll
          flowing
          className='genre-popup'
        >
          <Table padded='very' basic='very' fixed inverted>
            <Table.Body>
              {tableList}
            </Table.Body>
          </Table>
        </Popup>
      </React.Fragment>
    )
  }
}

export default GenreList;