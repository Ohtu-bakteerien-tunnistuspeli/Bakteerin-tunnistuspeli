import React from 'react'
import { useSelector } from 'react-redux'
import { Form } from 'react-bootstrap'

const Email = ({ email, setEmail, onChange, error, touched, handleBlur }) => {
    const library = useSelector(state => state.language)?.library?.frontend.user.components
    const handleChange = (event) => {
        event.preventDefault()
        setEmail(event.target.value)
        onChange('email', event.target.value)
    }
    return (
        <Form.Group controlId='email'>
            <Form.Label>{library.email}</Form.Label>
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