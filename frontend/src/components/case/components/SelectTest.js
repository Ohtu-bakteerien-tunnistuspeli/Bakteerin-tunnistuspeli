import React, { useState } from 'react'
import { Button, Form } from 'react-bootstrap'

const SelectTest = ({ addTest, testGroupIndex, testForCaseIndex, addedTests, tests }) => {
    const [test, setTest] = useState('')
    return (
        <>
            <td>
                <Form.Control
                    as='select'
                    id='testSelect'
                    value={test ? JSON.stringify(test) : ''}
                    onChange={(event) => event.target.value !== '' ? setTest(JSON.parse(event.target.value)) : setTest('')}
                >
                    <option value='' disabled hidden>Valitse testi</option>
                    {
                        tests.filter(t => !addedTests?.includes(t.id)).map(t =>
                            <option key={t.id} value={JSON.stringify(t)}>{t.name}</option>
                        )
                    }
                </Form.Control>
            </td>
            <td><Button onClick={() => {
                addTest(testGroupIndex, testForCaseIndex, test)
                setTest('')
                }}>Lisää testi</Button></td>
        </>
    )
}

export default SelectTest