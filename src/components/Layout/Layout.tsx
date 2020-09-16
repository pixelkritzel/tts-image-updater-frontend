import React from 'react';
import { observer } from 'mobx-react';
import { Box, Container, Typography } from '@material-ui/core';

interface LayoutProps {}

@observer
export class Layout extends React.Component {
  render() {
    return (
      <Container>
        <Typography component="div">
          <Box>{this.props.children}</Box>
        </Typography>
      </Container>
    );
  }
}
