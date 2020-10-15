import React from 'react';
import { computed, observable } from 'mobx';
import { observer } from 'mobx-react';
import { Link, RouteComponentProps, withRouter } from 'react-router-dom';

import { Button, styled, TextField } from '@material-ui/core';

import { StoreContext } from 'components/StoreContext';
import { axiosResponse } from 'utils/axios';

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
export class SignUpComponent extends React.Component<RouteComponentProps> {
  static contextType = StoreContext;
  context!: React.ContextType<typeof StoreContext>;

  @observable
  username = '';

  @observable
  password = '';

  @observable
  passwordRepetition = '';

  @computed
  get isSubmittable() {
    return (
      this.username.length > 2 &&
      this.password.length > 7 &&
      this.password === this.passwordRepetition
    );
  }

  onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const signUpResponse: axiosResponse<any> = await this.context.post('/signup', {
      username: this.username,
      password: this.password,
    });
    if (signUpResponse.type === 'SUCCESS') {
      const loginResponse = await this.context.login(this.username, this.password);
      if (loginResponse.type === 'SUCCESS') {
        await this.context.loadUser();
        this.props.history.push('/');
      }
    }
  };

  render() {
    return (
      <Form onSubmit={this.onSubmit}>
        <TextField label="User name" onChange={(event) => (this.username = event.target.value)} />
        <TextField
          type="password"
          label="Passsword"
          onChange={(event) => (this.password = event.target.value)}
        />
        <TextField
          type="password"
          label="Passsword repetition"
          onChange={(event) => (this.passwordRepetition = event.target.value)}
        />
        <Button type="submit" disabled={!this.isSubmittable}>
          Sign Up
        </Button>
        <div>
          or got to <Link to="/login">Login</Link>
        </div>
      </Form>
    );
  }
}

export const SignUp = withRouter(SignUpComponent);
