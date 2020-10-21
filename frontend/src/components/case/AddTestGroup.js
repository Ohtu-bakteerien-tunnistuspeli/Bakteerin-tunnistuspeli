import React from 'react'
import { Button, ButtonGroup, Form, Table } from 'react-bootstrap'

const AddTestGroup = ({ addingAlt, setAddingAlt, addingTest, setAddingTest, setTestForAlternativeTests,
    testForAlternativeTests, tests, tableWidth, cellWidth, testForCase, setTestForCase, addAlternativeTestToTestForCase,
    addTestForCaseToTestGroup, testGroup, addTestGroup }) => {

    return (
        <Form.Group>
            <Form.Label>Testiryhmät</Form.Label>
            {!addingAlt && !addingTest ?
                <>
                    <Form.Control
                        as='select'
                        id='testSelect'
                        onChange={(event) => setTestForAlternativeTests({ ...testForAlternativeTests, testName: JSON.parse(event.target.value).name, testId: JSON.parse(event.target.value).id })}>
                        {tests.map(test =>
                            <option key={test.id} value={JSON.stringify(test)}>{test.name}</option>
                        )}
                    </Form.Control>
                    <Form.Check
                        type='checkbox'
                        id='positive'
                        label='Positiivinen'
                        onChange={() => setTestForAlternativeTests({ ...testForAlternativeTests, positive: !testForAlternativeTests.positive })} />
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
                                <td>{alternativeTest.testName}</td>
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
                                        <select
                                            style={cellWidth}
                                            name='select2'
                                            id='testSelect2'
                                            onChange={(event) => setTestForAlternativeTests({ ...testForAlternativeTests, testName: JSON.parse(event.target.value).name, testId: JSON.parse(event.target.value).id })}>
                                            {tests.map(test =>
                                                <option key={test.id} value={JSON.stringify(test)}>{test.name}</option>
                                            )}
                                        </select>
                                    </td>
                                    <td>
                                        <Form.Check
                                            type='checkbox'
                                            id='positive2'
                                            label='Positiivinen'
                                            onChange={() => setTestForAlternativeTests({ ...testForAlternativeTests, positive: !testForAlternativeTests.positive })} />
                                    </td>
                                    <td>
                                        <Button
                                            type='button'
                                            id='addAlternativeTestForTest'
                                            onClick={() => { addAlternativeTestToTestForCase() }}>Lisää
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
                            onClick={() => { addAlternativeTestToTestForCase(); setAddingTest(true) }}>Lisää testi</Button>
                    </>
                }
                <Form.Check
                    type='checkbox'
                    id='required'
                    label='Pakollinen'
                    onChange={() => setTestForCase({ ...testForCase, isRequired: !testForCase.isRequired })} />
                {testForCase.tests.length > 0 ?
                    <Button
                        type='button'
                        id='addTestForGroup'
                        onClick={() => addTestForCaseToTestGroup()}>Lisää testi(t) ryhmään</Button>
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
                                                    <td>{alternativeTest.testName}</td>
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