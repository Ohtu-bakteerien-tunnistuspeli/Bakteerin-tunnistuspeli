import React from 'react'
import { Form } from 'react-bootstrap'

const Studentnumber = ({ studentnumber, setStudentnumber, onChange, error, touched, handleBlur }) => {
    const handleChange = (event) => {
        event.preventDefault()
        setStudentnumber(event.target.value)
        onChange('studentnumber', event.target.value)
    }
    return (
        <Form.Group controlId='studentnumber'>
            <Form.Label>Opiskelijanumero</Form.Label>
            <Form.Control
                type='text'
                isInvalid={error && touched}
                value={studentnumber}
                onChange={handleChange}
                onBlur={handleBlur}
            />
            <Form.Control.Feedback type='invalid' hidden={!touched}>
                {error}
            </Form.Control.Feedback>
        </Form.Group>
    )
}

export default Studentnumber