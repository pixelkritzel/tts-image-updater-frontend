import React from 'react';
import { observer } from 'mobx-react';
import { StoreContext } from 'components/StoreContext';
import { Backdrop, CircularProgress } from '@material-ui/core';

interface SpinnerProps {}

@observer
export class Spinner extends React.Component<SpinnerProps> {
  static contextType = StoreContext;
  context!: React.ContextType<typeof StoreContext>;

  render() {
    return (
      <Backdrop open={this.context.ui.showSpinner} style={{ zIndex: 'unset' }}>
        <CircularProgress color="inherit" />
      </Backdrop>
    );
  }
}
