import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { login } from '../reducers/userReducer'
import { useHistory } from 'react-router-dom'
import Notification from './Notification'
import { Form, Button } from 'react-bootstrap'
const Login = () => {
    const dispatch = useDispatch()
    const history = useHistory()
    const user = useSelector(state => state.user)
    const handleLogin = async (event) => {
        event.preventDefault()
        const username = event.target.username.value
        const password = event.target.password.value
        console.log('logging in with', username, password)
        try {
            dispatch(login(username, password))
        } catch (exeption) {
            console.log('Error occured in login')
        }
    }
    useEffect(() => {
        if(user) {
            history.push('/bakteeriLista')
        }
    }, [user, history])
    return (
        <div >
            <h2>Log in to Bakteeripeli</h2>
            <Form onSubmit={handleLogin}>
                <Form.Group>
                    <Form.Label>username:</Form.Label>
                    <Form.Control
                        type="text"
                        id="username"
                        name="username"
                    />
                    <Form.Label>password:</Form.Label>
                    <Form.Control
                        type="password"
                        id="password"
                    />
                    <Button id="submit" variant="primary" type="submit">
                        login
                    </Button>
                </Form.Group>
            </Form>
        </div>
    )
}

export default Login
