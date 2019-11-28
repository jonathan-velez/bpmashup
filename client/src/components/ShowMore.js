import React, { Fragment, useState, useEffect } from 'react';
import { Button } from 'semantic-ui-react';
import { animateScroll } from 'react-scroll';

const ShowMore = ({ content, reducedSize = 1200 }) => {
  const [expanded, setExpanded] = useState(false);

  const toggleExpanded = () => {
    if (expanded) {
      animateScroll.scrollToTop({ duration: 300 });
    }
    setExpanded(!expanded);
  }

  useEffect(() => {
    setExpanded(false);
  }, [content]);

  if (!content) {
    return null;
  }

  const reducedContent = content.length > reducedSize ? content.substr(0, reducedSize) : '';

  return (
    <Fragment>
      <div className='biography' id='biography'>
        {expanded || reducedContent.length === 0 ? content : reducedContent}
      </div>
      {reducedContent.length > 0 ?
        <Button basic onClick={toggleExpanded}>Show {expanded ? 'Less' : 'More'}</Button>
        :
        null
      }
    </Fragment>
  );

}

export default ShowMore;
