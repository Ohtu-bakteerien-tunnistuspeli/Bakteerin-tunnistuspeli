import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { addCase } from '../../reducers/caseReducer'
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
    const [sample, setSample] = useState({ name: '', rightAnswer: false })
    const [samples, setSamples] = useState([])
    const [testForCase, setTestForCase] = useState({ testName: tests[0].name, testId: tests[0].id, isRequired: false, positive: false, alternativeTests: false })
    const [testGroup, setTestGroup] = useState([])
    const [testGroups, setTestGroups] = useState([])

    const dispatch = useDispatch()

    const addNewCase = (event) => {
        event.preventDefault()
        console.log()
        dispatch(addCase(caseName, bacterium.id, anamnesis, completionImage, samples, testGroups, user.token, resetCaseForm))
    }

    const resetCaseForm = () => {
        setCaseName('')
        setBacterium(bacteria[0])
        setAnamnesis('')
        setCompletionImage(INITIAL_STATE)
        setSample({ name: '', rightAnswer: false })
        setSamples([])
        setTestForCase({ testName: tests[0].name, testId: tests[0].id, isRequired: false, positive: false, alternativeTests: false })
        setTestGroup([])
        setTestGroups([])
        document.querySelectorAll('input[type=checkbox]').forEach(el => el.checked = false);
        handleClose()
    }

    const [show, setShow] = useState(false)
    const handleShow = () => setShow(true)
    const handleClose = () => setShow(false)

    const addSample = (name, rightAnswer) => {
        setSamples(samples.concat({ name, rightAnswer }))
        setSample({
            ...sample,
            name: ''
        })
    }

    const addTestGroup = () => {
        setTestGroups([...testGroups, testGroup])
        setTestGroup([])
    }

    const handleCompletionImageChange = (event) => {
        setCompletionImage(event.target.files[0])
    }

    return (
        <div>
            <Button id='caseModalButton' variant="primary" onClick={handleShow}>
                Luo uusi tapaus
            </Button>
            <Modal show={show} size="lg" onHide={handleClose} backdrop="static">
                <Modal.Header closeButton></Modal.Header>
                <Modal.Body>
                    <Form onSubmit={addNewCase}>

                        <Form.Group controlId="name">
                            <Form.Label>Nimi</Form.Label>
                            <Form.Control value={caseName} onChange={(event) => setCaseName(event.target.value)} />
                        </Form.Group>

                        <Form.Group controlId="bacterium">
                            <Form.Label>Bakteeri</Form.Label>
                            <Form.Control as="select"
                                onChange={(event) => setBacterium(JSON.parse(event.target.value))}>
                                {bacteria.map(bacterium =>
                                    <option key={bacterium.id} value={JSON.stringify(bacterium)}>{bacterium.name}</option>
                                )}
                            </Form.Control>
                        </Form.Group>

                        <Form.Group controlId="anamnesis">
                            <Form.Label>Anamneesi</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows="3" value={anamnesis}
                                onChange={(event) => setAnamnesis(event.target.value)}
                            />
                        </Form.Group>

                        <Form.Group controlId="completionImage">
                            <Form.Label>Loppukuva</Form.Label>
                            <Form.Control
                                name='completionImage'
                                type="file" value={completionImage.image}
                                onChange={handleCompletionImageChange} />
                        </Form.Group>

                        <Form.Group controlId="samples">
                            <Form.Label>Näytevaihtoehdot</Form.Label>
                            <Form.Control
                                value={sample.name}
                                onChange={({ target }) => setSample({ ...sample, name: target.value })}
                            />
                            <Form.Check
                                type="checkbox"
                                id="isRightAnswer"
                                label="Oikea vastaus"
                                onChange={() => setSample({ ...sample, rightAnswer: !sample.rightAnswer })} />
                            <Button type="button" id="addSample" onClick={() => addSample(sample.name, sample.rightAnswer)}>+</Button>
                            <ListGroup>
                                {samples.map(sample => sample.rightAnswer ?
                                    <ListGroup.Item variant="success" key={sample.name}>{sample.name}</ListGroup.Item> :
                                    <ListGroup.Item variant="danger" key={sample.name}>{sample.name}</ListGroup.Item>
                                )}
                            </ListGroup>
                        </Form.Group>

                        <Form.Group>
                            <Form.Label>Testiryhmät</Form.Label>
                            <Form.Control
                                as="select"
                                id="testSelect"
                                onChange={(event) => setTestForCase({ ...testForCase, testName: JSON.parse(event.target.value).name, testId: JSON.parse(event.target.value).id })}>
                                {tests.map(test =>
                                    <option key={test.id} value={JSON.stringify(test)}>{test.name}</option>
                                )}
                            </Form.Control>
                            <Form.Check
                                type="checkbox"
                                id="required"
                                label="Pakollinen"
                                onChange={() => setTestForCase({ ...testForCase, isRequired: !testForCase.isRequired })} />
                            <Form.Check
                                type="checkbox"
                                id="positive"
                                label="Positiivinen"
                                onChange={() => setTestForCase({ ...testForCase, positive: !testForCase.positive })} />
                            <Form.Check
                                type="checkbox"
                                id="alternative"
                                label="Vaihtoehtoinen testi"
                                onChange={() => setTestForCase({ ...testForCase, alternativeTests: !testForCase.alternativeTests })} />
                            <ButtonGroup vertical>
                                <Button
                                    type="button"
                                    id="addTestForGroup"
                                    onClick={() => setTestGroup([...testGroup, testForCase])}>Lisää testi
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
                                        {testGroup.map((testForCase, i) =>
                                            <tr key={i}>
                                                <td>{testForCase.testName}</td>
                                                <td>{testForCase.isRequired ? 'Kyllä' : 'Ei'}</td>
                                                <td>{testForCase.positive ? 'Kyllä' : 'Ei'}</td>
                                                <td>{testForCase.alternativeTests ? 'Kyllä' : 'Ei'}</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </Table>
                                <Button
                                    type="button"
                                    id="addTestGroup"
                                    onClick={() => addTestGroup()}>Lisää testiryhmä
                                </Button>
                            </ButtonGroup>
                        </Form.Group>


                        {testGroups.map((testGroup, i) =>
                            <Table key={i} striped bordered hover id="testGroupsTable">
                                <thead>
                                    <tr>
                                        <th>Testi</th>
                                        <th>Pakollinen</th>
                                        <th>Positiivinen</th>
                                        <th>Vaihtoehtoinen</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {testGroup.map((testForCase, j) =>
                                        <tr key={j}>
                                            <td>{testForCase.testName}</td>
                                            <td>{testForCase.isRequired ? 'Kyllä' : 'Ei'}</td>
                                            <td>{testForCase.positive ? 'Kyllä' : 'Ei'}</td>
                                            <td>{testForCase.alternativeTests ? 'Kyllä' : 'Ei'}</td>
                                        </tr>
                                    )}
                                </tbody>
                            </Table>
                        )}


                        <Button
                            variant="primary"
                            type="submit"
                            id="addCase">
                            Lisää
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>
        </div>
    )
}

export default CaseForm