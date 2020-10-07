import React from 'react'
import { Form, Table } from 'react-bootstrap'



const TestGroup = ({ testgroup, index, removeTestGroup }) => {
    console.log('this is the testgroup')
    console.log(testgroup)
    return (
        <div>
            <Form.Label>Testiryhmä {index + 1}</Form.Label><button onClick={(event) => {
                event.preventDefault()
                removeTestGroup(testgroup)
            }}>Poista</button>

            <Table>
                <thead>
                    <tr>
                        <th>Testi</th>
                        <th>Pakollinen</th>
                        <th>Positiivinen</th>
                        <th>Vaihtoehtoinen</th>
                    </tr>
                </thead>
                <tbody>
                    {testgroup.map((testOfCase, j) =>
                        <tr key={j}>
                            <td>{testOfCase.test.name}</td>
                            <td>{testOfCase.isRequired ? 'Kyllä' : 'Ei'}</td>
                            <td>{testOfCase.positive ? 'Kyllä' : 'Ei'}</td>
                            <td>{testOfCase.alternativeTests ? 'Kyllä' : 'Ei'}</td>
                        </tr>
                    )}
                </tbody>
            </Table>
        </div>

    )
}

export default TestGroup
