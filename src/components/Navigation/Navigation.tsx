import React from 'react';
import { observer } from 'mobx-react';
import { AppBar, Button, styled, Toolbar } from '@material-ui/core';
import { Link, RouteComponentProps, withRouter } from 'react-router-dom';
import { UnregisterCallback } from 'history';
import { observable } from 'mobx';
import { StoreContext } from 'components/StoreContext';

const StyledToolbar = styled(Toolbar)({
  display: 'flex',
});

class IntelligentToolbar extends React.Component {
  get hasOneChild() {
    return React.Children.toArray(this.props.children).filter((child) => !!child).length === 1;
  }

  render() {
    return (
      <StyledToolbar style={{ justifyContent: this.hasOneChild ? 'flex-end' : 'space-between' }}>
        {this.props.children}
      </StyledToolbar>
    );
  }
}

interface NavigationProps extends RouteComponentProps {}

@observer
class NavigationComponent extends React.Component<NavigationProps> {
  static contextType = StoreContext;
  context!: React.ContextType<typeof StoreContext>;

  cleanUpHistoryListener?: UnregisterCallback;

  @observable
  pathname?: string;

  componentDidMount() {
    this.pathname = this.props.location.pathname;
    this.cleanUpHistoryListener = this.props.history.listen((location) => {
      this.pathname = location.pathname;
    });
  }

  componentWillUnmount() {
    this.cleanUpHistoryListener!();
  }

  render() {
    return (
      <AppBar position="fixed">
        <IntelligentToolbar>
          {this.pathname && this.pathname.startsWith('/image-sets') && (
            <Link style={{ color: 'inherit', textDecoration: 'none' }} href="/" to="/">
              <Button color="inherit" component="span">
                All image sets
              </Button>
            </Link>
          )}

          {this.context.ui.isLoggedIn && (
            <Button color="inherit" onClick={this.context.logout}>
              Logout
            </Button>
          )}
        </IntelligentToolbar>
      </AppBar>
    );
  }
}

export const Navigation = withRouter(NavigationComponent);
