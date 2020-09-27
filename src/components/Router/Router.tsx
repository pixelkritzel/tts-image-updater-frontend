import { Home } from 'components/Home';
import { ImageSet } from 'components/ImageSet';
import { Login } from 'components/Login';
import { SignUp } from 'components/SignUp';
import { StoreContext } from 'components/StoreContext';
import { observer } from 'mobx-react';
import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';

interface RouterProps {}

@observer
export class Router extends React.Component {
  static contextType = StoreContext;
  context!: React.ContextType<typeof StoreContext>

  render() {
    return (
      <BrowserRouter>
        <Switch>
          <Route path="/login">
            <Login />
          </Route>
          <Route path="/image-sets/:imageSetId" component={ImageSet}></Route>
          <Route path="/">
            {this.context.user ? <Home /> : <SignUp />}
          </Route>
        </Switch>
      </BrowserRouter>
    );
  }
}
