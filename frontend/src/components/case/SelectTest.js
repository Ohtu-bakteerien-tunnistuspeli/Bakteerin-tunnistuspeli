import React from 'react'
import { Form } from 'react-bootstrap'
const SelectTest = ({ tests, setTest, test, onChange, value, error }) => {

    const handleChange = event => {
        event.preventDefault()
        console.log(onChange)
        onChange('test', event.target.value)
    }
    return (
        <>
            <Form.Control
                as='select'
                id='testSelect'
                value={value}
                isInvalid={error}
                onChange={(event) => {
                    setTest({ ...test, name: JSON.parse(event.target.value).name, testId: JSON.parse(event.target.value).id })
                    handleChange(event)
                }}>
                <option value=''>Valitse testi</option>
                {
                    tests.map(t =>
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