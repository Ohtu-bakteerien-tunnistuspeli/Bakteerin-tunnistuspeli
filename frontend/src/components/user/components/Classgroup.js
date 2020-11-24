import React from 'react'
import { useSelector } from 'react-redux'
import { Form } from 'react-bootstrap'

const Classgroup = ({ classgroup, setClassgroup, onChange, error, touched, handleBlur }) => {
    const library = useSelector(state => state.language)?.library?.frontend.user.components
    const handleChange = (event) => {
        event.preventDefault()
        setClassgroup(event.target.value)
        onChange('classgroup', event.target.value)
    }
    return (
        <Form.Group controlId='classgroup'>
            <Form.Label>{library.classGroup}</Form.Label>
            <Form.Control
                type='text'
                isInvalid={error && touched}
                value={classgroup}
                onChange={handleChange}
                onBlur={handleBlur}
            />
            <Form.Control.Feedback type='invalid' hidden={!touched}>
                {error}
            </Form.Control.Feedback>
        </Form.Group>
    )
}

export default Classgroup