import React from 'react'
import { Form, Table, Button, Container, Row, Col, ListGroup } from 'react-bootstrap'



const TestGroup = ({ testgroup, index, removeTestGroup, tests }) => {

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
                            <th>Testi</th>
                            <th>Pakollinen</th>
                            <th>Positiivinen</th>
                            <th>Vaihtoehtoinen</th>
                        </tr>
                    </thead>
                    <tbody>
                        {testgroup.map((testOfCase, j) =>
                            <tr key={j}>
                                <td>{testOfCase.test ? testOfCase.test.name : tests.find(t  => t.id === testOfCase.testId).name }</td>
                                <td>{testOfCase.isRequired ? 'Kyllä' : 'Ei'}</td>
                                <td>{testOfCase.positive ? 'Kyllä' : 'Ei'}</td>
                                <td>{testOfCase.alternativeTests ? 'Kyllä' : 'Ei'}</td>
                            </tr>
                        )}
                    </tbody>
                </Table>
            </ListGroup.Item>
        </div>

    )
}

export default TestGroup
