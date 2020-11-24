import React from 'react'
import { Form } from 'react-bootstrap'
import { useSelector } from 'react-redux'

const Name = ({ name, setName, onChange, error, touched, handleBlur }) => {
    const library = useSelector(state => state.language)?.library?.frontend.case.components
    const handleChange = (event) => {
        event.preventDefault()
        setName(event.target.value)
        onChange('name', event.target.value)
    }
    return (
        <Form.Group controlId='name'>
            <Form.Label>{library.name}</Form.Label>
            <Form.Control
                type='text'
                isInvalid={error && touched}
                value={name}
                onChange={handleChange}
                onBlur={handleBlur}
            />
            <Form.Control.Feedback type='invalid' hidden={!touched}>
                {error}
            </Form.Control.Feedback>
        </Form.Group>
    )
}

export default Name