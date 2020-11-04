import React from 'react'
import { Form } from 'react-bootstrap'

const Name = ({ name, setName, onChange, error, touched }) => {
    const handleChange = (event) => {
        event.preventDefault()
        setName(event.target.value)
        onChange('name', event.target.value)
    }
    return (
        <Form.Group controlId='name'>
            <Form.Label>Nimi</Form.Label>
            <Form.Control
                type="text"
                isInvalid={error && touched}
                value={name}
                onChange={handleChange}
            />
            <Form.Control.Feedback type="invalid">
                {error}
            </Form.Control.Feedback>
        </Form.Group>
    )
}

export default Name