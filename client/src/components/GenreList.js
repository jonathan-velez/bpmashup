import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Popup, Icon, Menu, Table } from 'semantic-ui-react';

import { transposeArray } from '../utils/helpers';

const GenreList = ({ genres }) => {
  const [popupOpen, setPopupOpen] = useState(false);

  const closePopup = () => {
    setPopupOpen(false);
  }

  const openPopup = () => {
    setPopupOpen(true);
  }

  let tableList = null;

  if (Array.isArray(genres) && genres.length > 0) {
    const transposedGenres = transposeArray(genres, 4);

    let rowLength = null;

    tableList = transposedGenres.map((genreRow, idx) => {
      if (+idx === 0) {
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
              <Table.Cell key={id} onClick={closePopup} textAlign='center' selectable>
                <Link to={genreUrl}>{name.toUpperCase()}</Link>
              </Table.Cell>
            )
          })}
          {cellsMade !== rowLength ?
            <Table.Cell>&nbsp;</Table.Cell> : null}
        </Table.Row>
      )
    })
  }

  return (
    <React.Fragment>
      <Popup
        trigger={<Menu.Item>GENRES<Icon name='dropdown' /></Menu.Item>}
        position='bottom left'
        wide='very'
        on='click'
        open={popupOpen}
        onClose={closePopup}
        onOpen={openPopup}
        basic
        verticalOffset={-10}
        size='small'
        flowing
        className='genre-popup'
      >
        <Table padded='very' basic='very' fixed>
          <Table.Body>
            {tableList}
          </Table.Body>
        </Table>
      </Popup>
    </React.Fragment>
  )
}

export default GenreList;
