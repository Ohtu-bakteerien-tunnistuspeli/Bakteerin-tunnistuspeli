import React from 'react'
import { Form } from 'react-bootstrap'

const Username = ({ username, setUsername, onChange, error, touched, handleBlur }) => {
    const handleChange = (event) => {
        event.preventDefault()
        setUsername(event.target.value)
        onChange('username', event.target.value)
    }
    return (
        <Form.Group controlId='username'>
            <Form.Label>Käyttäjänimi</Form.Label>
            <Form.Control
                type='text'
                isInvalid={error && touched}
                value={username}
                onChange={handleChange}
                onBlur={handleBlur}
            />
            <Form.Control.Feedback type='invalid' hidden={!touched}>
                {error}
            </Form.Control.Feedback>
        </Form.Group>
    )
}

export default Username