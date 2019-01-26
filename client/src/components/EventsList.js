import React from 'react';
import { List, Icon } from 'semantic-ui-react';

const EventsList = ({ events }) => {
  if (!Array.isArray(events) || events.length === 0) return null;

  return (
    <List verticalAlign='middle'>
      {events.map((event, idx) => {
        return (
          <List.Item key={idx}>
            <Icon name='calendar alternate' />
            <List.Content>
              <List.Header><a href={event.uri} target='_blank'>{event.venue.displayName}</a> ({event.start.date})</List.Header>
              <Icon name='map marker alternate' /> {event.location.city}
            </List.Content>
          </List.Item>
        )
      })}
    </List>
  );
};

export default EventsList;
