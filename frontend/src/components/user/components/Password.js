import React from 'react'
import { Form } from 'react-bootstrap'

const Password = ({ password, label, setPassword, onChange, error, touched, setFieldTouched, instruction }) => {
    const handleChange = (event) => {
        event.preventDefault()
        if (setPassword) {
            if(!touched && setFieldTouched) {
                setFieldTouched('password', true, true)
            }
            setPassword(event.target.value)
        }
        onChange('password', event.target.value)
    }
    return (
        <Form.Group controlId='password'>
            <Form.Label className="required-field">{label}</Form.Label>
            <Form.Control
                type='password'
                isInvalid={error && touched}
                value={password}
                placeholder='***********'
                onChange={handleChange}
            />
            <Form.Text muted>
                {instruction}
            </Form.Text>
            <Form.Control.Feedback type='invalid' hidden={!touched}>
                {error}
            </Form.Control.Feedback>
        </Form.Group>
    )
}

export default Password