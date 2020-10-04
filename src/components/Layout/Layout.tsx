import React from 'react';
import { observer } from 'mobx-react';
import { Box, Container, styled, Typography } from '@material-ui/core';
import { Navigation } from 'components/Navigation';
import { BrowserRouter } from 'react-router-dom';

const StyledBox = styled(Box)({
  marginTop: '88px',
});

@observer
export class Layout extends React.Component {
  render() {
    return (
      <Container>
        <Typography component="div">
          <BrowserRouter>
            <Navigation />
            <StyledBox>{this.props.children}</StyledBox>
          </BrowserRouter>
        </Typography>
      </Container>
    );
  }
}
