import React from 'react';
import { observer } from 'mobx-react';
import { styled, Typography } from '@material-ui/core';

interface DropZoneUiProps {}

const DropZone = styled('div')({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  height: 'calc(100% - 48px)',
  width: '100%',
  marginTop: '24px',
  marginBottom: '24px',
  border: '3px dashed #03a9f4',
  backgroundColor: '#f2f2f2',
});

@observer
export class DropZoneUi extends React.Component<DropZoneUiProps> {
  render() {
    return (
      <DropZone>
        <Typography component="div" variant="h2">
          Drop files here!
        </Typography>
      </DropZone>
    );
  }
}
