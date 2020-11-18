import React from 'react'
import { useDispatch } from 'react-redux'
import { generateSingleUsePassword } from '../../reducers/userReducer'
import { useHistory } from 'react-router-dom'
import { Form, Button } from 'react-bootstrap'
const SingleUsePassword = () => {
    const dispatch = useDispatch()
    const history = useHistory()
    const handleSingleUsePassword = async (event) => {
        event.preventDefault()
        const username = event.target.username.value
        const email = event.target.email.value
        dispatch(generateSingleUsePassword(username, email, history))
    }
    return (
        <div>
            <h2>Kertakäyttöisen salasanan luonti</h2>
            <Form onSubmit={handleSingleUsePassword}>
                <Form.Group>
                    <Form.Label>Käyttäjänimi:</Form.Label>
                    <Form.Control
                        type='text'
                        id='username'
                        name='username'
                    />
                    <Form.Label>Sähköpostiosoite:</Form.Label>
                    <Form.Control
                        type='text'
                        id='email'
                        name='email'
                    />
                    <Button id='submit' variant='primary' type='submit'>
                        Luo kertakäyttöinen salasana
                    </Button>
                </Form.Group>
            </Form>
        </div>
    )
}

export default SingleUsePassword
