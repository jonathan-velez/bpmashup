// TODO: bug - actions in short succession clash
import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux'
import { Message, Transition, List } from 'semantic-ui-react';
import _ from 'lodash';

import { removeActionMessage } from '../actions/ActionCreators';

class ActionMessage extends React.PureComponent {
  render() {
    const { actionMessage, removeActionMessage } = this.props;

    return (
      <Transition.Group
        as={List}
        className='action-message-list'
        animation='fly down'
        duration={1000}
      >
        {_.map(actionMessage, ((message, idx) => {
          return (
            <List.Item key={idx}>
              <Message
                positive
                compact
                floating
                className='action-message-list-item'
                content={message}
                onDismiss={() => removeActionMessage(idx)}
              />
            </List.Item>
          )
        }))}
      </Transition.Group>
    );
  }
}

const mapStateToProps = state => {
  return {
    actionMessage: state.actionMessage,
  }
}

const mapDispatchToProps = dispatch => {
  return bindActionCreators({  
    removeActionMessage,
  }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(ActionMessage);