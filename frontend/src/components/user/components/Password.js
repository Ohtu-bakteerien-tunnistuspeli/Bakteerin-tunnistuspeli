import React from 'react'
import { Form } from 'react-bootstrap'

const Password = ({ password, label, setPassword, onChange, error, touched, handleBlur }) => {
    const handleChange = (event) => {
        event.preventDefault()
        setPassword(event.target.value)
        onChange('password', event.target.value)
    }
    return (
        <Form.Group controlId='password'>
            <Form.Label>{label}</Form.Label>
            <Form.Control
                type='text'
                isInvalid={error && touched}
                value={password}
                onChange={handleChange}
                onBlur={handleBlur}
            />
            <Form.Control.Feedback type='invalid' hidden={!touched}>
                {error}
            </Form.Control.Feedback>
        </Form.Group>
    )
}

export default Password