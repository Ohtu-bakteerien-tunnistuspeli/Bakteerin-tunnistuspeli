import React from 'react'
import { Form } from 'react-bootstrap'

const Type = ({ typeControlId, testType, setTestType }) => {
    return (
        <>
            <Form.Group controlId={typeControlId}>
                <Form.Label>Tyyppi</Form.Label>
                <Form.Control as='select'
                    value={testType}
                    onChange={(event) => setTestType(event.target.value)}>
                    <option key='1' value='' disabled hidden>Valitse testin tyyppi</option>
                    <option key='2' value='Värjäys'>Värjäys</option>
                    <option key='3' value='Testi'>Testi</option>
                    <option key='4' value='Viljely'>Viljely</option>
                </Form.Control>
            </Form.Group>
        </>
    )
}

export default Type