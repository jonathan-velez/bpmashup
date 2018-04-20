import React from 'react';

const SeekBar = props => {
  const { played, seekMouseDown, seekChange, seekMouseUp } = props;
  return (
    <input
      type='range'
      min={0}
      max={1}
      step='any'
      value={played}
      onMouseDown={seekMouseDown}
      onChange={seekChange}
      onMouseUp={seekMouseUp}
    />
  );
};

export default SeekBar;