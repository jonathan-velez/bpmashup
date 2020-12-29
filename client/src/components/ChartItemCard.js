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
    images = {},
    slug,
    name,
    publishDate,
    chartOwner = {},
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
          {publishDate && `Published on ${publishDate}`}
          {chartOwner && ` by ${chartOwner.name}`}
        </h5>
      </Dimmer>
      <Image
        src={images.xlarge && images.xlarge.secureUrl}
        as={Link}
        to={`/chart/${slug}/${id}`}
      />
    </Dimmer.Dimmable>
  );
};

export default withRouter(ChartItemCard);
