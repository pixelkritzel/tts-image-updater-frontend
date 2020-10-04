import * as React from 'react';
import { observer } from 'mobx-react';
import { observable } from 'mobx';
import { storeModel } from 'store/storeModel';

import { Layout } from 'components/Layout';
import { Router } from 'components/Router';
import { StoreContext } from 'components/StoreContext';
import { Backdrop, CircularProgress, CssBaseline } from '@material-ui/core';

@observer
export default class App extends React.Component {
	@observable store = storeModel.create({ ui: {} });

	render() {
		return (
			<StoreContext.Provider value={this.store}>
				<CssBaseline />
				<Layout>
					<Router />
				</Layout>
				{this.store.ui.showSpinner && (
					<Backdrop open={true} style={{ zIndex: 'unset' }}>
						<CircularProgress color="inherit" />
					</Backdrop>
				)}
			</StoreContext.Provider>
		);
	}
}
