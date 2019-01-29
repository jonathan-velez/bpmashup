import React, { Component, Fragment } from 'react';
import { Button } from 'semantic-ui-react';
import Scroll from 'react-scroll';

class ShowMore extends Component {
  state = {
    expanded: false,
  }

  toggleExpanded = () => {
    if (this.state.expanded) {
      Scroll.animateScroll.scrollToTop({ duration: 1500 });
    }
    this.setState({ expanded: !this.state.expanded });
  }

  componentDidUpdate(prevProps) {
    if (prevProps.content !== this.props.content) {
      this.setState({ expanded: false });
    }
  }

  render() {
    const { content, reducedSize = 1250 } = this.props;
    const { expanded } = this.state;

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
          <Button basic onClick={this.toggleExpanded}>Show {expanded ? 'Less' : 'More'}</Button>
          :
          null
        }
      </Fragment>
    );
  }
}

export default ShowMore;
