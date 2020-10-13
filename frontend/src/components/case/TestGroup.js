import React from 'react'
import { Form, Table, Button, Container, Row, Col, ListGroup } from 'react-bootstrap'



const TestGroup = ({ testgroup, index, removeTestGroup }) => {
    return (
        <div>
            <ListGroup.Item>
                <Container>
                    <Row>
                        <Col xs={10}>
                            <Form.Label>Testiryhmä {index + 1}</Form.Label>
                        </Col>
                        <Col>
                            <Button variant='danger'
                                onClick={(event) => {
                                    event.preventDefault()
                                    removeTestGroup(testgroup)
                                }}>Poista</Button>
                        </Col>
                    </Row>
                </Container>

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
                                                    <td>{alternativeTest.test ? alternativeTest.test.name : alternativeTest.name}</td>
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
            </ListGroup.Item>
        </div>

    )
}

export default TestGroup