import * as React from 'react';
import { observer } from 'mobx-react';
import { observable } from 'mobx';
import { storeModel } from 'store/storeModel';

import { Layout } from 'components/Layout';
import { Router } from 'components/Router';
import { StoreContext } from 'components/StoreContext';

@observer
export default class App extends React.Component {
  @observable
  store = storeModel.create({ ui: { username: 'user9' } });

  render() {
    return (
      <StoreContext.Provider value={this.store}>
        <Layout>
          <Router />
        </Layout>
      </StoreContext.Provider>
    );
  }
}
