import * as React from 'react';
import { observer } from 'mobx-react';
import { storeModel } from 'store/storeModel';

import { Layout } from 'components/Layout';
import { Router } from 'components/Router';
import { StoreContext } from 'components/StoreContext';
import { CssBaseline } from '@material-ui/core';
import { Spinner } from 'components/Spinner';

@observer
export default class App extends React.Component<{}> {
  store = storeModel.create({ ui: {} });

  render() {
    return (
      <StoreContext.Provider value={this.store}>
        <CssBaseline />
        <Layout>
          <Router />
        </Layout>
        <Spinner />
      </StoreContext.Provider>
    );
  }
}
