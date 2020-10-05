import React from 'react';
import { computed, observable } from 'mobx';
import { observer } from 'mobx-react';
import { Link, RouteComponentProps, withRouter } from 'react-router-dom';

import { Button, styled, TextField } from '@material-ui/core';

import { StoreContext } from 'components/StoreContext';

const Form = styled('form')({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  height: '100vh',
  '& > *:not(:last-child)': {
    marginBottom: '24px',
  },
});

@observer
class LoginComponent extends React.Component<RouteComponentProps> {
  static contextType = StoreContext;
  context!: React.ContextType<typeof StoreContext>;

  @observable
  username = '';

  @observable
  password = '';

  @computed
  get isSubmittable() {
    return this.username.length > 2 && this.password.length > 7;
  }

  onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const response = await this.context.login(this.username, this.password);
    if (response.type === 'SUCCESS') {
      await this.context.loadUser();
      this.props.history.push('/');
    }
  };

  render() {
    return (
      <Form onSubmit={this.onSubmit}>
        <TextField
          label="User name"
          value={this.username}
          onChange={(event) => (this.username = event.target.value)}
        />
        <TextField
          type="password"
          value={this.password}
          label="Passsword"
          onChange={(event) => (this.password = event.target.value)}
        />
        <Button type="submit" disabled={!this.isSubmittable}>
          Login
        </Button>
        <div>
          or got to <Link to="/signup">SignUp</Link>
        </div>
      </Form>
    );
  }
}

export const Login = withRouter(LoginComponent);
