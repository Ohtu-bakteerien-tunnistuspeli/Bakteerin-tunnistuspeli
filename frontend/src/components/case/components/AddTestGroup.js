import React from 'react'
import SelectTest from './SelectTest.js'
import { Button, ButtonGroup, Form, Table } from 'react-bootstrap'

const AddTestGroup = ({ addingAlt, setAddingAlt, addingTest, setTest,
    test, tests, tableWidth, testForCase, setTestForCase, addTest,
    addTestToTestGroup, testGroup, addTestGroup,
    onChange, value, error, addedTests, touched
}) => {

    return (
        <Form.Group>
            {!addingAlt && !addingTest ?
                <>
                    <SelectTest tests={tests} setTest={setTest} test={test} onChange={onChange} value={value}
                        error={error} addedTests={addedTests} touched={touched}
                    ></SelectTest>

                    <Form.Check
                        type='checkbox'
                        id='positive'
                        label='Positiivinen'
                        onChange={() => setTest({ ...test, positive: !test.positive })} />
                </>
                :
                <></>
            }
            <ButtonGroup vertical>
                <Table style={tableWidth} striped bordered hover id='alternativeTestsTable'>
                    {testForCase.tests.length > 0 ?
                        <thead>
                            <tr>
                                <th>Testi</th>
                                <th>Positiivinen</th>
                                <th></th>
                            </tr>
                        </thead>
                        : <thead></thead>}
                    <tbody>
                        {testForCase.tests.map((alternativeTest, i) =>
                            <tr key={i}>
                                <td>{alternativeTest.name}</td>
                                <td>{alternativeTest.positive ? 'Kyllä' : 'Ei'}</td>
                                <td>{i === 0 && !addingAlt ?
                                    <Button
                                        type='button'
                                        id='addAlternativeTestForTest'
                                        onClick={() => setAddingAlt(true)}>Lisää vaihtoehtoinen testi
                                    </Button>
                                    :
                                    <></>
                                }</td>
                            </tr>
                        )}
                        <tr>
                            {addingAlt ?
                                <>
                                    <td>
                                        <SelectTest tests={tests} setTest={setTest} test={test} onChange={onChange} error={error} addedTests={addedTests} touched={touched}></SelectTest>
                                    </td>
                                    <td>
                                        <Form.Check
                                            type='checkbox'
                                            id='positive2'
                                            label='Positiivinen'
                                            onChange={() => setTest({ ...test, positive: !test.positive })} />
                                    </td>
                                    <td>
                                        <Button
                                            type='button'
                                            id='addAlternativeTestForTest'
                                            onClick={() => { addTest(onChange) }}>Lisää
                                        </Button>
                                    </td>
                                </>
                                :
                                <></>
                            }
                        </tr>
                    </tbody>
                </Table>
                {testForCase.tests.length > 0 ?
                    <></>
                    :
                    <>
                        <Button
                            type='button'
                            id='addAlternativeTestForTest'
                            onClick={() => addTest(onChange)}>Lisää testi</Button>
                    </>
                }
                <Form.Check
                    type='checkbox'
                    id='required'
                    label='Pakollinen'
                    checked={testForCase.isRequired}
                    onChange={() => setTestForCase({ ...testForCase, isRequired: !testForCase.isRequired })} />
                {testForCase.tests.length > 0 ?
                    <Button
                        type='button'
                        id='addTestForGroup'
                        onClick={() => addTestToTestGroup()}>Lisää testi(t) ryhmään</Button>
                    :
                    <></>
                }
                <Table striped bordered hover id='testGroupTable'>
                    {testGroup.length > 0 ?
                        <thead>
                            <tr>
                                <th>Testit</th>
                                <th>Pakollinen</th>
                            </tr>
                        </thead>
                        : <thead></thead>}
                    <tbody>
                        {testGroup.map((testForCase, i) =>
                            <tr key={i}>
                                <td>
                                    <Table striped bordered hover id='testGroupTable'>
                                        {testForCase.tests.length > 0 ?
                                            <thead>
                                                <tr>
                                                    <th>Testi</th>
                                                    <th>Positiivinen</th>
                                                </tr>
                                            </thead>
                                            : <thead></thead>}
                                        <tbody>
                                            {testForCase.tests.map((alternativeTest, j) =>
                                                <tr key={j}>
                                                    <td>{alternativeTest.name}</td>
                                                    <td>{alternativeTest.positive ? 'Kyllä' : 'Ei'}</td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </Table>
                                </td>
                                <td>{testForCase.isRequired ? 'Kyllä' : 'Ei'}</td>
                            </tr>
                        )}
                    </tbody>
                </Table>
                <Button
                    type='button'
                    id='addTestGroup'
                    onClick={() => addTestGroup()}>Lisää testiryhmä
                </Button>
            </ButtonGroup>
        </Form.Group>
    )

}

export default AddTestGroup