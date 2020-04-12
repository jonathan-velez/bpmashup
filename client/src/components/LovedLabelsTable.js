import React from 'react';
import _ from 'lodash';
import { Link } from 'react-router-dom';
import { Table, Header, Image } from 'semantic-ui-react';

import TitleHeader from './TitleHeader';

const LovedLabelsTable = (labelDetails) => {
  const { labels } = labelDetails;
  if (!labels || labels.length === 0) return null;

  const orderedLabels = _.sortBy(labels, 'lastPublishDate').reverse();
  const lovedLabelsDetails = orderedLabels.map(label => {
    return (
      <Table.Row key={label.id}>
        <Table.Cell>
          <Header as='h4' image>
            <Image src={label.images.large.secureUrl} rounded size='mini' />
            <Header.Content>
              <Link to={`/label/${label.slug}/${label.id}`}>{label.name}</Link>
            </Header.Content>
          </Header>
        </Table.Cell>
        <Table.Cell>
          {label.lastPublishDate}
        </Table.Cell>
      </Table.Row>
    )
  });

  return (
    <React.Fragment>
      <TitleHeader headerTitle='My Loved Labels' />
      <Table basic='very' celled collapsing>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Label</Table.HeaderCell>
            <Table.HeaderCell>Last Publish Date</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {lovedLabelsDetails}
        </Table.Body>
      </Table>
    </React.Fragment>
  );
};

export default LovedLabelsTable;
