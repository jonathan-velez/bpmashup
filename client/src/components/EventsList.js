import React from 'react';
import { List, Icon } from 'semantic-ui-react';

const EventsList = ({ eventsData }) => {
  if (!Array.isArray(eventsData) || eventsData.length === 0) return null;

  return (
    <List  floated='left'>
      {eventsData.map((event, idx) => {
        return (
          <List.Item key={idx}>
            <Icon name='calendar alternate' />
            <List.Content>
              <List.Header><a href={event.uri} target='_blank' rel="noopener noreferrer">{event.venue.displayName}</a> ({event.start.date})</List.Header>
              <Icon name='map marker alternate' /> {event.location.city}
            </List.Content>
          </List.Item>
        )
      })}
    </List>
  );
};

export default EventsList;
