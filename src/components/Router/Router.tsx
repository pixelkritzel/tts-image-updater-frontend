import { Home } from 'components/Home';
import { ImageSet } from 'components/ImageSet';
import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';

interface RouterProps {}

export class Router extends React.Component {
  render() {
    return (
      <BrowserRouter>
        <Switch>
          <Route path="/image-sets/:imageSetId" component={ImageSet}></Route>
          <Route path="/">
            <Home />
          </Route>
        </Switch>
      </BrowserRouter>
    );
  }
}
