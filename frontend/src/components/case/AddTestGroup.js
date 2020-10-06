import React from 'react'
import { Button, ButtonGroup, Form, Table } from 'react-bootstrap'

const AddTestGroup = ({ setCaseTest,
    setTestBools, testBools, tests, handleTestAdd, 
    testGroup, addTestGroup }) => {

    return (
        <div>
            <Form.Control
                as="select"
                id="testSelect"
                onChange={setCaseTest}>
                {tests.map(test =>
                    <option key={test.id} value={test.id}>{test.name}</option>
                )}
            </Form.Control>
            <Form.Check
                type="checkbox"
                id="required"
                label="Pakollinen"
                onChange={() => setTestBools({ ...testBools, required: !testBools.required })} />
            <Form.Check
                type="checkbox"
                id="positive"
                label="Positiivinen"
                onChange={() => setTestBools({ ...testBools, positive: !testBools.positive })} />
            <Form.Check
                type="checkbox"
                id="alternative"
                label="Vaihtoehtoinen testi"
                onChange={() => setTestBools({ ...testBools, alternativeTests: !testBools.alternativeTests })} />
            <ButtonGroup vertical>
                <Button
                    type="button"
                    id="addTestForGroup"
                    onClick={handleTestAdd}>Lisää testi
</Button>
                <Table striped bordered hover id="testGroupTable">
                    {testGroup.length > 0 ?
                        <thead>
                            <tr>
                                <th>Testi</th>
                                <th>Pakollinen</th>
                                <th>Positiivinen</th>
                                <th>Vaihtoehtoinen</th>
                            </tr>
                        </thead>
                        : <thead></thead>}
                    <tbody>
                        {testGroup.map((tg, i) =>
                            <tr key={i}>
                                <td>{tg.test.name}</td>
                                <td>{testBools.required ? 'Kyllä' : 'Ei'}</td>
                                <td>{testBools.positive ? 'Kyllä' : 'Ei'}</td>
                                <td>{testBools.alternativeTests ? 'Kyllä' : 'Ei'}</td>
                            </tr>
                        )}
                    </tbody>
                </Table>
                <Button
                    type="button"
                    id="addTestGroup"
                    onClick={addTestGroup}>Lisää testiryhmä
</Button>
            </ButtonGroup>
        </div>
    )

}

export default AddTestGroup
