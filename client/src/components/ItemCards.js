import React from 'react';
import { Link } from 'react-router-dom';
import { Grid, Card, Image, Header } from 'semantic-ui-react';

import { constructLinks } from '../utils/trackUtils';

const ItemCards = ({ items, itemType }) => {
  const itemsRow = Array.isArray(items) && items.map(item => {
    const { slug, id, images, name } = item;
    let linkUrl = '';
    let metaContent = '';

    switch (itemType) {
      case 'artist':
        linkUrl = `/artist/${slug}/${id}`;
        break;
      case 'label':
        linkUrl = `/label/${slug}/${id}`;
        break;
      case 'release':
        const { artists, label } = item;
        linkUrl = `/release/${slug}/${id}`;
        metaContent =
          <React.Fragment>
            <Card.Meta className='boldedText'>
              {constructLinks(artists, 'artist', 3)}
            </Card.Meta>
            <Card.Meta>
              [<Link to={`/label/${label.slug}/${label.id}`}>{label.name}</Link>]
            </Card.Meta>
          </React.Fragment>
        break;
      default:
        linkUrl = `/most-popular/${itemType}/${slug}/${id}`;
        break;
    }

    return (
      <Card key={id}>
        <Link to={linkUrl}>
          <Image src={images.large.secureUrl} />
        </Link>
        <Card.Content>
          <Card.Header>
            <Link to={linkUrl} className='release-title'>{name}</Link>
          </Card.Header>
          {metaContent}
        </Card.Content>
      </Card>
    )
  })

  return (
    <React.Fragment>
      {itemsRow.length > 0 ?
        <Grid.Row>
          <Grid.Column>
            <Header textAlign='left' dividing>{itemType.concat('S').toUpperCase()}</Header>
            <Card.Group itemsPerRow={4}>
              {itemsRow}
            </Card.Group>
          </Grid.Column>
        </Grid.Row>
        : null
      }
    </React.Fragment>
  );
};

export default ItemCards;
