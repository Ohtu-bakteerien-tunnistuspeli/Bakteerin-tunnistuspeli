import React from 'react'
import { Form } from 'react-bootstrap'

const Email = ({ email, setEmail, onChange, error, touched, handleBlur }) => {
    const handleChange = (event) => {
        event.preventDefault()
        setEmail(event.target.value)
        onChange('email', event.target.value)
    }
    return (
        <Form.Group controlId='username'>
            <Form.Label>Sähköposti</Form.Label>
            <Form.Control
                type='text'
                isInvalid={error && touched}
                value={email}
                onChange={handleChange}
                onBlur={handleBlur}
            />
            <Form.Control.Feedback type='invalid' hidden={!touched}>
                {error}
            </Form.Control.Feedback>
        </Form.Group>
    )
}

export default Email