import React from 'react';
import { IReactionDisposer, reaction } from 'mobx';
import { observer } from 'mobx-react';
import { Switch, Route, withRouter, RouteComponentProps } from 'react-router-dom';

import { Home } from 'components/Home';
import { ImageSet } from 'components/ImageSet';
import { Login } from 'components/Login';
import { StoreContext } from 'components/StoreContext';

interface RouterProps extends RouteComponentProps {}

@observer
class RouterComponent extends React.Component<RouterProps> {
  static contextType = StoreContext;
  context!: React.ContextType<typeof StoreContext>;

  disposer?: IReactionDisposer;

  componentDidMount() {
    this.disposer = reaction(
      () => !this.context.ui.isLoggedIn,
      () => {
        this.props.history.replace('/');
      }
    );
  }

  componentWillUnmount() {
    this.disposer!();
  }

  render() {
    return (
      <Switch>
        <Route path="/login">
          <Login />
        </Route>
        <Route path="/image-sets/:imageSetId" component={ImageSet}></Route>
        <Route path="/">{this.context.user ? <Home /> : <Login />}</Route>
      </Switch>
    );
  }
}

export const Router = withRouter(RouterComponent);
