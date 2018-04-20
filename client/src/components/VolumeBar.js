import React from 'react';

const VolumeBar = ({ volume, setVolume }) => {
  return (
    <input
      type='range' min={0} max={1} step='any'
      value={volume}
      onChange={setVolume}
    />
  );
};

export default VolumeBar;