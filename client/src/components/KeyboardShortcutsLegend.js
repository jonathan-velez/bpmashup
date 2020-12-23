import React from 'react';
import { Helmet } from 'react-helmet';
import {
  Table,
  Icon,
  TableHeaderCell,
  TableRow,
  TableCell,
} from 'semantic-ui-react';

import TitleHeader from './TitleHeader';
import { DEFAULT_PAGE_TITLE } from '../constants/defaults';

const KeyboardShortcutsLegend = () => {
  const legend = [
    {
      key: 'p',
      action: 'Toggle Play/Pause',
      iconName: 'play',
    },
    {
      key: 'n',
      action: 'Next Track',
      iconName: 'step forward',
    },
    {
      key: 'b',
      action: 'Previous Track',
      iconName: 'step backward',
    },
    {
      key: 'right arrow',
      action: 'Fast Forward 5 seconds',
      iconName: 'fast forward',
    },
    {
      key: 'left arrow',
      action: 'Rewind 5 seconds',
      iconName: 'fast backward',
    },
    {
      key: '=',
      action: 'Volume Up',
      iconName: 'volume up',
    },
    {
      key: '-',
      action: 'Volume Down',
      iconName: 'volume down',
    },
    {
      key: 'm',
      action: 'Toggle Mute',
      iconName: 'mute',
    },
    {
      key: 'f',
      action: 'Play full track (from YouTube)',
      iconName: 'youtube play',
    },
    {
      key: 'd',
      action: 'Download Track',
      iconName: 'download',
    },
  ];

  return (
    <>
      <Helmet>
        <title>Keyboard Shortcuts :: {DEFAULT_PAGE_TITLE}</title>
      </Helmet>
      <TitleHeader headerTitle='Keyboard Shortcuts' />
      <Table compact>
        <Table.Header>
          <TableHeaderCell>Key</TableHeaderCell>
          <TableHeaderCell>Action</TableHeaderCell>
        </Table.Header>
        <Table.Body>
          {legend.map((item) => {
            const { key, action, iconName } = item;
            return (
              <TableRow>
                <TableCell>{key}</TableCell>
                <TableCell>
                  <Icon name={iconName} /> {action}
                </TableCell>
              </TableRow>
            );
          })}
        </Table.Body>
      </Table>
    </>
  );
};

export default KeyboardShortcutsLegend;
