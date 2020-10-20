import React from 'react'
import { Button, ButtonGroup, Form, Table } from 'react-bootstrap'

const AddTestGroup = ({ testForAlternativeTests,
    testForCase, addAlternativeTestToTestForCase, tests, setTestForCase,
    testGroup, addTestGroup, addTestForCaseToTestGroup, setTestForAlternativeTests }) => {

    return (
        <div>
            <Form.Control
                as='select'
                id='testSelect'
                onChange={(event) => setTestForAlternativeTests({ ...testForAlternativeTests, name: JSON.parse(event.target.value).name, testId: JSON.parse(event.target.value).id })}>
                {tests.map(test =>
                    <option key={test.id} value={JSON.stringify(test)}>{test.name}</option>
                )}
            </Form.Control>
            <Form.Check
                type='checkbox'
                id='positive'
                label='Positiivinen'
                onChange={() => setTestForAlternativeTests({ ...testForAlternativeTests, positive: !testForAlternativeTests.positive })} />
            <ButtonGroup vertical>
                <Table striped bordered hover id='alternativeTestsTable'>
                    {testForCase.tests.length > 0 ?
                        <thead>
                            <tr>
                                <th>Testi</th>
                                <th>Positiivinen</th>
                            </tr>
                        </thead>
                        : <thead></thead>}
                    <tbody>
                        {testForCase.tests.map((alternativeTest, i) =>
                            <tr key={i}>
                                <td>{alternativeTest.name}</td>
                                <td>{alternativeTest.positive ? 'Kyllä' : 'Ei'}</td>
                            </tr>
                        )}
                    </tbody>
                </Table>
                {testForCase.tests.length > 0 ?
                    <Button
                        type='button'
                        id='addAlternativeTestForTest'
                        onClick={() => addAlternativeTestToTestForCase()}>Lisää vaihtoehtoinen testi</Button>
                    :
                    <>
                        <Button
                            type='button'
                            id='addAlternativeTestForTest'
                            onClick={() => addAlternativeTestToTestForCase()}>Lisää testi</Button>
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
                        onClick={() => addTestForCaseToTestGroup()}>Lisää testit ryhmään</Button>
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
        </div>
    )

}

export default AddTestGroup