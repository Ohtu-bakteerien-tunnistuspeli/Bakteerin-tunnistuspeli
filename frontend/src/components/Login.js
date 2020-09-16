import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { login } from '../reducers/userReducer'
import { useHistory } from 'react-router-dom'
import { setNotification } from '../reducers/notificationReducer'
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
        try {
            dispatch(login(username, password))
            dispatch(setNotification({ message: `Kirjauduit sisään onnistuneesti, ${username}` }))
        } catch (exeption) {
            console.log('Kirjautuessa tapahtui virhe')
        }
    }
    useEffect(() => {
        if(user) {
            history.push('/bakteeriLista')
        }
    }, [user, history])
    return (
        <div >
            <h2>Kirjaudu Bakteeripeliin</h2>
            <Form onSubmit={handleLogin}>
                <Form.Group>
                    <Form.Label>Käyttäjänimi:</Form.Label>
                    <Form.Control
                        type="text"
                        id="username"
                        name="username"
                    />
                    <Form.Label>Salasana:</Form.Label>
                    <Form.Control
                        type="password"
                        id="password"
                    />
                    <Button id="submit" variant="primary" type="submit">
                        Kirjaudu
                    </Button>
                </Form.Group>
            </Form>
        </div>
    )
}

export default Login
