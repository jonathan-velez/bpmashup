import React from 'react';
import { Link } from 'react-router-dom';
import { Image, Label, Segment } from 'semantic-ui-react';
import Slider from 'react-slick';

import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const ChartSlider = ({ charts }) => {
  return (
    <Slider
      autoplay
      draggable
      speed={500}
      autoplaySpeed={8000}
      dots
      infinite
      slidesToShow={4}
      slidesToScroll={4}
    >
      {charts.map((chart) => {
          return (
            <div key={chart.id}>
              <Segment padded>
                <Label attached='bottom'>{chart.name || 'name'}</Label>
                <Image
                  as={Link}
                  to={`/chart/${chart.slug}/${chart.id}`}
                  src={chart.images.xlarge && chart.images.xlarge.secureUrl}
                />
              </Segment>
            </div>
          );
      })}
    </Slider>
  );
};

export default ChartSlider;
