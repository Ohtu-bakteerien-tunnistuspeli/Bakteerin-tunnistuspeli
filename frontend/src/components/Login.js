import React from 'react'
import { useDispatch } from 'react-redux'
import { login } from '../reducers/userReducer'
import { useHistory } from 'react-router-dom'
import { Form, Button } from 'react-bootstrap'
const Login = () => {
    const dispatch = useDispatch()
    const history = useHistory()
    const handleLogin = async (event) => {
        event.preventDefault()
        const username = event.target.username.value
        const password = event.target.password.value
        try {
            dispatch(login(username, password, history))
        } catch (exeption) {
            console.log('Kirjautuessa tapahtui virhe')
        }
    }
    return (
        <div >
            <h2>For testing purposes</h2>
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
