import React from 'react'
import { Form } from 'react-bootstrap'
const SelectTest = ({ tests, setTest, test, onChange, value, error, addedTests }) => {

    const handleChange = event => {
        event.preventDefault()
        onChange('test', event.target.value)
    }

    return (
        <>
            <Form.Control
                as='select'
                id='testSelect'
                value={value}
                isInvalid={error}
                onChange={(event) => { event.target.value !== '' ?
                    setTest({ ...test, name: JSON.parse(event.target.value).name, testId: JSON.parse(event.target.value).id }):setTest('')
                handleChange(event)
                }}>
                <option value=''>Valitse testi</option>
                {
                    tests.filter(t => !addedTests?.includes(t.id)).map(t =>
                        <option key={t.id} value={JSON.stringify(t)}>{t.name}</option>
                    )
                }
            </Form.Control>
            <Form.Control.Feedback type="invalid">
                {error}
            </Form.Control.Feedback>
        </>
    )
}

export default SelectTest