import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import Slider from 'react-slick';
import { connect } from 'react-redux';
import { fetchBeatportCharts } from '../thunks';
import { Image, Label, Segment } from 'semantic-ui-react';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

import TracklistingHeader from './TracklistingHeader';

const BeatportCharts = ({ isLoading, fetchBeatportCharts, beatportCharts }) => {
  useEffect(() => {
    fetchBeatportCharts();
  }, [fetchBeatportCharts]);

  if (isLoading) return <div>Loading...</div>;

  const { results = {} } = beatportCharts;
  const { charts = [] } = results;

  return (
    <React.Fragment>
      <TracklistingHeader headerPrefix='TOP' headerTitle='CHARTS' />
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
    </React.Fragment>
  );
};

const mapStateToProps = (state) => {
  const { isLoading, beatportCharts } = state;
  return {
    isLoading,
    beatportCharts,
  };
};

const mapDispatchToProps = { fetchBeatportCharts };

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(BeatportCharts);
