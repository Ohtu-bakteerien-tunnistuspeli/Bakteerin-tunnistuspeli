import React from 'react'
import { Form } from 'react-bootstrap'

const Type = ({ typeControlId, testType, onChange, error, touched, setTestType }) => {
    const handleChange = (event) => {
        event.preventDefault()
        setTestType(event.target.value)
        onChange('testType', event.target.value)
    }
    return (
        <>
            <Form.Group controlId={typeControlId}>
                <Form.Label>Tyyppi</Form.Label>
                <Form.Control as='select'
                    value={testType}
                    isInvalid={error && touched}
                    onChange={handleChange}>
                    <option key='1' value='' disabled hidden>Valitse testin tyyppi</option>
                    <option key='2' value='Värjäys'>Värjäys</option>
                    <option key='3' value='Testi'>Testi</option>
                    <option key='4' value='Viljely'>Viljely</option>
                </Form.Control>
            <Form.Control.Feedback type="invalid">
                {error}
            </Form.Control.Feedback>
        </Form.Group>
        </>
    )
}

export default Type