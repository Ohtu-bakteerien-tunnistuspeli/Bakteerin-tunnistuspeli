
import React from 'react'
import { Form } from 'react-bootstrap'

const Name = ({ nameControlId, testName, setTestName }) => {
    return (
        <>
            <Form.Group controlId={nameControlId}>
                <Form.Label>Nimi</Form.Label>
                <Form.Control value={testName} onChange={(event) => setTestName(event.target.value)} reset='' />
            </Form.Group>
        </>
    )
}

export default Name