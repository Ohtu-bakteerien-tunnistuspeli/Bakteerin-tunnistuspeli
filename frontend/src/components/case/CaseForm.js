import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { addCase } from '../../reducers/caseReducer'
import { setNotification } from '../../reducers/notificationReducer'
import { Modal, Button, ButtonGroup, Form, ListGroup, Table } from 'react-bootstrap'

const CaseForm = () => {

    const INITIAL_STATE = {
        id: '',
        image: undefined
    }

    const bacteria = useSelector(state => state.bacteria)?.sort((bacterium1, bacterium2) => bacterium1.name.localeCompare(bacterium2.name))
    const tests = useSelector(state => state.test)?.sort((test1, test2) => test1.name.localeCompare(test2.name))
    const user = useSelector(state => state.user)

    const [caseName, setCaseName] = useState('')
    const [bacterium, setBacterium] = useState(bacteria[0])
    const [anamnesis, setAnamnesis] = useState('')
    const [completionImage, setCompletionImage] = useState(INITIAL_STATE)
    const [sample, setSample] = useState({ description: '', rightAnswer: false })
    const [samples, setSamples] = useState([])
    const [testForAlternativeTests, setTestForAlternativeTests] = useState({ testName: tests[0].name, testId: tests[0].id, positive: false })
    const [testForCase, setTestForCase] = useState({ isRequired: false, tests: [] })
    const [testGroup, setTestGroup] = useState([])
    const [testGroups, setTestGroups] = useState([])

    const dispatch = useDispatch()

    const addNewCase = (event) => {
        event.preventDefault()
        dispatch(addCase(caseName, bacterium.id, anamnesis, completionImage, samples, testGroups, user.token, resetCaseForm))
        handleClose()
    }

    const resetCaseForm = () => {
        setCaseName('')
        setBacterium(bacteria[0])
        setAnamnesis('')
        setCompletionImage(INITIAL_STATE)
        setSample({ description: '', rightAnswer: false })
        setSamples([])
        setTestForAlternativeTests({ testName: tests[0].name, testId: tests[0].id, positive: false })
        setTestForCase({ isRequired: false, tests: [] })
        setTestGroup([])
        setTestGroups([])
        document.querySelectorAll('input[type=checkbox]').forEach(el => el.checked = false)
    }

    const [show, setShow] = useState(false)
    const handleShow = () => setShow(true)
    const handleClose = () => {
        setShow(false)
        console.log('huhuuu')
        resetCaseForm()
    }

    const addSample = (description, rightAnswer) => {
        if (samples.map(sample => sample.description).includes(description)) {
            dispatch(setNotification({ message: 'Näytteen kuvaus on jo käytössä', success: false }))
        } else {
            setSamples(samples.concat({ description, rightAnswer }))
            setSample({
                ...sample,
                description: ''
            })
        }

    }

    const addTestGroup = () => {
        if (testGroup.length > 0) {
            setTestGroups([...testGroups, testGroup])
            setTestGroup([])
        }
    }

    const addTestForCaseToTestGroup = () => {
        if (testForCase.tests.length > 0) {
            setTestGroup([...testGroup, testForCase])
            setTestForCase({ isRequired: testForCase.isRequired, tests: [] })
        }
    }

    const addAlternativeTestToTestForCase = () => {
        setTestForCase({ ...testForCase, tests: testForCase.tests.concat(testForAlternativeTests) })
    }

    const handleCompletionImageChange = (event) => {
        setCompletionImage(event.target.files[0])
    }

    return (
        <div>
            <Button id='caseModalButton' variant='primary' onClick={handleShow}>
                Luo uusi tapaus
            </Button>
            <Modal show={show} size='lg' onHide={handleClose} backdrop='static'>
                <Modal.Header closeButton>Luo uusi tapaus</Modal.Header>
                <Modal.Body>
                    <Form onSubmit={addNewCase}>

                        <Form.Group controlId='name'>
                            <Form.Label>Nimi</Form.Label>
                            <Form.Control value={caseName} onChange={(event) => setCaseName(event.target.value)} />
                        </Form.Group>

                        <Form.Group controlId='bacterium'>
                            <Form.Label>Bakteeri</Form.Label>
                            <Form.Control as='select'
                                onChange={(event) => setBacterium(JSON.parse(event.target.value))}>
                                {bacteria.map(bacterium =>
                                    <option key={bacterium.id} value={JSON.stringify(bacterium)}>{bacterium.name}</option>
                                )}
                            </Form.Control>
                        </Form.Group>

                        <Form.Group controlId='anamnesis'>
                            <Form.Label>Anamneesi</Form.Label>
                            <Form.Control
                                as='textarea'
                                rows='3' value={anamnesis}
                                onChange={(event) => setAnamnesis(event.target.value)}
                            />
                        </Form.Group>

                        <Form.Group controlId='completionImage'>
                            <Form.Label>Loppukuva</Form.Label>
                            <Form.Control
                                name='completionImage'
                                type='file' value={completionImage.image}
                                onChange={handleCompletionImageChange} />
                        </Form.Group>

                        <Form.Group controlId='samples'>
                            <Form.Label>Näytevaihtoehdot</Form.Label>
                            <Form.Control
                                value={sample.description}
                                onChange={({ target }) => setSample({ ...sample, description: target.value })}
                            />
                            <Form.Check
                                type='checkbox'
                                id='isRightAnswer'
                                label='Oikea vastaus'
                                onChange={() => setSample({ ...sample, rightAnswer: !sample.rightAnswer })} />
                            <Button type='button' id='addSample' onClick={() => addSample(sample.description, sample.rightAnswer)}>+</Button>
                            <ListGroup>
                                {samples.map(sample => sample.rightAnswer ?
                                    <ListGroup.Item variant='success' key={sample.description}>{sample.description}</ListGroup.Item> :
                                    <ListGroup.Item variant='danger' key={sample.description}>{sample.description}</ListGroup.Item>
                                )}
                            </ListGroup>
                        </Form.Group>

                        <Form.Group>
                            <Form.Label>Testiryhmät</Form.Label>
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
                                                <td>{alternativeTest.testName}</td>
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


                        {testGroups.map((testGroup, i) =>
                            <div key={i} >
                                <div>{`Testiryhmä: ${i + 1}`}</div>
                                <Table striped bordered hover id='testGroupsTable'>
                                    <thead>
                                        <tr>
                                            <th>Testit</th>
                                            <th>Pakollinen</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {testGroup.map((testForCase, j) =>
                                            <tr key={j}>
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
                                                            {testForCase.tests.map((alternativeTest, k) =>
                                                                <tr key={k}>
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
                            </div>
                        )}
                        <Button
                            variant='primary'
                            type='submit'
                            id='addCase'>
                            Lisää
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>
        </div>
    )
}

export default CaseForm