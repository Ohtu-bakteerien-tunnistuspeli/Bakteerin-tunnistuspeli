import React from 'react'
import { Form, Table } from 'react-bootstrap'



const TestGroup = ({ testgroup, index, removeTestGroup }) => {
    return (
        <div>
            <Form.Label>Testiryhmä {index + 1}</Form.Label><button onClick={(event) => {
                event.preventDefault()
                removeTestGroup(testgroup)
            }}>Poista</button>

            <Table>
                <thead>
                    <tr>
                        <th>Testit</th>
                        <th>Pakollinen</th>
                    </tr>
                </thead>
                <tbody>
                    {testgroup.map((testOfCase, j) =>
                        <tr key={j}>
                            <td>
                                <Table>
                                    <thead>
                                        <tr>
                                            <th>Testi</th>
                                            <th>Positiivinen</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {testOfCase.tests.map((alternativeTest, k) =>
                                            <tr key={k}>
                                                <td>{alternativeTest.test.name}</td>
                                                <td>{alternativeTest.positive ? 'Kyllä' : 'Ei'}</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </Table>
                            </td>
                            <td>{testOfCase.isRequired ? 'Kyllä' : 'Ei'}</td>
                        </tr>
                    )}
                </tbody>
            </Table>
        </div>

    )
}

export default TestGroup
