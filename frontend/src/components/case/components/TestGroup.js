import React from 'react'
import { Form, Table, Button, Container, Row, Col, ListGroup } from 'react-bootstrap'
import SelectTest from './SelectTest'



const TestGroup = ({ testgroup, index, removeTestGroup, testGroupsSize, testGroupSwitch, addEmptyTestForCase, removeTestForCase, changeTestForCaseIsRequired, addTest, removeTest, changeTestPositive, tests, addedTests }) => {
    return (
        <div>
            <ListGroup.Item>
                <Container>
                    <Row>
                        <Col xs={10}>
                            <Form.Label><b>Testiryhmä {index + 1}</b>  {index > 0 ? <i className='fa fa-arrow-up' onClick={() => testGroupSwitch(index, index - 1)} /> : <></>}{index < testGroupsSize - 1 ? <i className='fa fa-arrow-down' onClick={() => testGroupSwitch(index, index + 1)} /> : <></>}</Form.Label>
                        </Col>
                        <Col>
                            <Button variant='danger'
                                onClick={(event) => {
                                    event.preventDefault()
                                    removeTestGroup(testgroup)
                                }}>Poista
                                <svg width='1em' height='1em' viewBox='0 0 16 16' className='bi bi-trash' fill='currentColor' xmlns='http://www.w3.org/2000/svg'>
                                    <path d='M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z' />
                                    <path fillRule='evenodd' d='M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4L4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z' />
                                </svg>
                            </Button>
                        </Col>
                    </Row>
                </Container>

                <Table id={index === 0 ? 'testGroupTable' : `testGroupTable${index}`}>
                    <thead>
                        <tr>
                            <th>Testit</th>
                            <th>Pakollinen</th>
                            <th></th>
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
                                                <th></th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {testOfCase.tests.map((alternativeTest, k) =>
                                                <tr key={k}>
                                                    <td>{alternativeTest.test ? alternativeTest.test.name : alternativeTest.name}</td>
                                                    <td>
                                                        <Form.Check
                                                            type='checkbox'
                                                            id='positive'
                                                            checked={alternativeTest.positive}
                                                            onChange={() => changeTestPositive(index, j, k)} />
                                                    </td>
                                                    <td>
                                                        <Button variant='danger'
                                                            onClick={() => removeTest(index, j, k)}>Poista
                                                            <svg width='1em' height='1em' viewBox='0 0 16 16' className='bi bi-trash' fill='currentColor' xmlns='http://www.w3.org/2000/svg'>
                                                                <path d='M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z' />
                                                                <path fillRule='evenodd' d='M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4L4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z' />
                                                            </svg>
                                                        </Button>
                                                    </td>
                                                </tr>
                                            )}
                                            <tr>
                                                <SelectTest
                                                    addTest={addTest}
                                                    testGroupIndex={index}
                                                    testForCaseIndex={j}
                                                    addedTests={addedTests}
                                                    tests={tests}
                                                    hasAlternative={testOfCase.tests.length > 0}
                                                />
                                            </tr>
                                        </tbody>
                                    </Table>
                                </td>
                                <td>
                                    <Form.Check
                                        type='checkbox'
                                        id='required'
                                        checked={testOfCase.isRequired}
                                        onChange={() => changeTestForCaseIsRequired(index, j)} />
                                </td>
                                <td>
                                    <Button variant='danger'
                                        onClick={() => removeTestForCase(index, j)}>Poista
                                <svg width='1em' height='1em' viewBox='0 0 16 16' className='bi bi-trash' fill='currentColor' xmlns='http://www.w3.org/2000/svg'>
                                            <path d='M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z' />
                                            <path fillRule='evenodd' d='M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4L4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z' />
                                        </svg>
                                    </Button>
                                </td>
                            </tr>
                        )}
                        <tr>
                            <td><Button id={index === 0 ? 'addTestForCase' : `addTestForCase${index}`} onClick={() => addEmptyTestForCase(index)}>Lisää tyhjä testi</Button></td>
                        </tr>
                    </tbody>
                </Table>
            </ListGroup.Item>
        </div>

    )
}

export default TestGroup