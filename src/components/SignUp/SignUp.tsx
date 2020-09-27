import { Button, styled, TextField } from '@material-ui/core'
import { computed, observable } from 'mobx'
import { observer } from 'mobx-react'
import React from 'react'
import { Link } from 'react-router-dom'
import { axios } from 'utils/axios'

const Form = styled('form')({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    '& > *:not(:last-child)': {
        marginBottom: '24px'
    }
})

@observer
export class SignUp extends React.Component {
    @observable
    username = ''

    @observable
    password = ''
    
    @observable
    passwordRepetition = ''

    @computed
    get isSubmittable() {
        return this.username.length > 2 && this.password.length > 7 && this.password === this.passwordRepetition
    }

    onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        axios.post('/signup', { username: this.username, password: this.password })
    }

    render() {
        return <Form onSubmit={this.onSubmit}>
            <TextField label="User name" onChange={event => this.username = event.target.value} />
            <TextField type="password" label="Passsword" onChange={event => this.password = event.target.value} />
            <TextField type="password" label="Passsword repetition" onChange={event => this.passwordRepetition = event.target.value} />
            <Button type="submit" disabled={!this.isSubmittable}>Sign Up</Button>
            <div>or got to <Link to='/login'>Login</Link></div>
        </Form>
    }
}