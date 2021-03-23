import React, { useState } from 'react';
import { Dimmer, Image } from 'semantic-ui-react';
import { Link, withRouter } from 'react-router-dom';

const ChartItemCard = ({ chartItem, history }) => {
  const [active, setActive] = useState(false);

  const handleShow = () => setActive(true);
  const handleHide = () => setActive(false);
  const handleClick = () => history.push(`/chart/${slug}/${id}`);

  if (!chartItem) return null;

  const {
    id,
    image = {},
    slug,
    name,
    publish_date,
    person = {},
  } = chartItem;

  return (
    <Dimmer.Dimmable
      dimmed={active}
      onMouseEnter={handleShow}
      onMouseLeave={handleHide}
      onClick={handleClick}
    >
      <Dimmer active={active} style={{ cursor: 'pointer', zIndex: 99 }}>
        <h3>{name}</h3>
        <h5>
          {publish_date && `Published on ${publish_date}`}
          {person && person.owner_name && ` by ${person.owner_name}`}
        </h5>
      </Dimmer>
      <Image
        src={image && image.uri}
        as={Link}
        to={`/chart/${slug}/${id}`}
      />
    </Dimmer.Dimmable>
  );
};

export default withRouter(ChartItemCard);
