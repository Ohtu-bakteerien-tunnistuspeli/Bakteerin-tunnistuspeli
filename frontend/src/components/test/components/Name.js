
import React from 'react'
import { Form } from 'react-bootstrap'

const Name = ({ nameControlId, error, onChange, testName, touched, setTestName }) => {
    const handleChange = (event) => {
        event.preventDefault()
        setTestName(event.target.value)
        onChange('testName', event.target.value)
    }

    return (
        <>
            <Form.Group controlId={nameControlId}>
                <Form.Label style={{ paddingTop: '30px' }}>Nimi</Form.Label>
                <Form.Control
                    type="text"
                    isInvalid={error && touched}
                    value={testName}
                    onChange={handleChange}
                    reset='' />
            <Form.Control.Feedback type="invalid">
                {error}
            </Form.Control.Feedback>
        </Form.Group>
        </>
    )
}

export default Name