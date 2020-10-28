import React from 'react'
import { Form } from 'react-bootstrap'
const SelectTest = ({ tests, setTest, test }) => {
    return (
        <Form.Control
            as='select'
            id='testSelect'
            value={test ? test.name : ''}
            onChange={(event) => setTest({ ...test, name: JSON.parse(event.target.value).name, testId: JSON.parse(event.target.value).id })}>
            <option value='' disabled hidden>Valitse testi</option>
            {
                tests.map(t =>
                    <option key={t.id} value={JSON.stringify(t)}>{t.name}</option>
                )
            }
        </Form.Control>
    )
}

export default SelectTest