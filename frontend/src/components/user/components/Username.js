import React from 'react'
import { useSelector } from 'react-redux'
import { Form } from 'react-bootstrap'

const Username = ({ username, setUsername, onChange, error, touched, handleBlur }) => {
    const library = useSelector(state => state.language)?.library?.frontend.user.components
    const handleChange = (event) => {
        event.preventDefault()
        setUsername(event.target.value)
        onChange('username', event.target.value)
    }
    return (
        <Form.Group controlId='username'>
            <Form.Label>{library.username}</Form.Label>
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