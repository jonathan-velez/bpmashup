import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import _ from 'lodash';
import { Item, Header } from 'semantic-ui-react';

import * as thunks from '../thunks';

class MyLovedLabels extends React.Component {
  componentDidMount() {
    this.props.getMyFavoriteLabels(this.props.lovedLabels);
  }

  render() {
    const { labels } = this.props.lovedLabelsDetails;

    if (labels && Object.keys(labels).length > 0) {
      const orderedLabels = _.sortBy(labels, 'name');
      this.lovedLabelsDetails = orderedLabels.map(label => {
        return (
          <Item key={label.id}>
            <Item.Image src={label.images.large.secureUrl} />
            <Item.Content verticalAlign='middle'>
              <Item.Header>{label.name}</Item.Header>
            </Item.Content>
          </Item>
        )
      });
    }

    return (
      <React.Fragment>
        <Header size='huge'>Labels</Header>
        <Item.Group>
          {this.lovedLabelsDetails}
        </Item.Group>
      </React.Fragment>
    )
  }
}

const mapStateToProps = state => {
  return {
    lovedLabels: state.lovedLabels,
    lovedLabelsDetails: state.lovedLabelsDetails,
  }
}

const mapDispatchToProps = dispatch => {
  return bindActionCreators(thunks, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(MyLovedLabels);