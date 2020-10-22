import React, { useState } from 'react'
import Sample from './Sample.js'
import AddSample from './AddSample.js'
import TestGroup from './TestGroup.js'
import AddTestGroup from './AddTestGroup.js'
import { useDispatch, useSelector } from 'react-redux'
import { addCase } from '../../reducers/caseReducer'
import { setNotification } from '../../reducers/notificationReducer'
import { Modal, Button, Form, Table } from 'react-bootstrap'

const CaseForm = () => {

    const INITIAL_STATE = {
        id: '',
        image: undefined
    }

    const tableWidth = {
        tableLayout: 'fixed',
        width: '100%'
    }

    const cellWidth = {
        width: '100%'
    }

    const bacteria = useSelector(state => state.bacteria)?.sort((bacterium1, bacterium2) => bacterium1.name.localeCompare(bacterium2.name))
    const tests = useSelector(state => state.test)?.sort((test1, test2) => test1.name.localeCompare(test2.name))
    const user = useSelector(state => state.user)

    const [caseName, setCaseName] = useState('')
    const [bacterium, setBacterium] = useState(bacteria[0])
    const [anamnesis, setAnamnesis] = useState('')
    const [completionImage, setCompletionImage] = useState(INITIAL_STATE)

    const [testForAlternativeTests, setTestForAlternativeTests] = useState({ testName: tests[0].name, testId: tests[0].id, positive: false })
    const [testForCase, setTestForCase] = useState({ isRequired: false, tests: [] })
    const [testGroup, setTestGroup] = useState([])
    const [testGroups, setTestGroups] = useState([])

    const [addingAlt, setAddingAlt] = useState(false)
    const [addingTest, setAddingTest] = useState(false)

    const dispatch = useDispatch()

    const addNewCase = (event) => {
        event.preventDefault()
        console.log(samples)
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
        setAddingAlt(false)
        setAddingTest(false)
        document.querySelectorAll('input[type=checkbox]').forEach(el => el.checked = false)
    }

    const [show, setShow] = useState(false)
    const handleShow = () => setShow(true)
    const handleClose = () => {
        setShow(false)
        setAddingAlt(false)
        resetCaseForm()
    }

    const [sample, setSample] = useState({ description: '', rightAnswer: false })
    const [samples, setSamples] = useState([])
    const deleteSample = (sampleToDelete) => setSamples(samples.filter(s => s.description !== sampleToDelete.description))
    const addSample = (description, rightAnswer) => {
        if (description !== '') {
            if (samples.map(sample => sample.description).includes(description)) {
                dispatch(setNotification({ message: 'Näytteen kuvaus on jo käytössä', success: false }))
            } else {
                setSamples(samples.concat({ description, rightAnswer }))
                setSample({
                    description: '',
                    rightAnswer: false
                })
            }
        }
    }

    const removeTestGroup = (tg) => {
        setTestGroups(testGroups.filter(testgroup => testgroup !== tg))
    }
    const addTestGroup = () => {
        if (testGroup.length > 0) {
            setTestGroups([...testGroups, testGroup])
            setTestGroup([])
        }
        setAddingAlt(false)
        setAddingTest(false)
    }

    const addTestForCaseToTestGroup = () => {
        if (testForCase.tests.length > 0) {
            setTestForAlternativeTests({ testName: tests[0].name, testId: tests[0].id, positive: false })
            setTestGroup([...testGroup, testForCase])
            setTestForCase({ isRequired: testForCase.isRequired, tests: [] })
        }
        setAddingAlt(false)
        setAddingTest(false)
    }

    const addAlternativeTestToTestForCase = () => {
        setTestForCase({ ...testForCase, tests: testForCase.tests.concat(testForAlternativeTests) })
        setAddingAlt(false)
        //setTestForAlternativeTests({ testName: tests[0].name, testId: tests[0].id, positive: false })
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

                        <Form.Group>
                            <Form.Label>Näytevaihtoehdot</Form.Label>
                            <Table>
                                <tbody>
                                    {samples.map(s =>
                                        <Sample key={s.description}
                                            sample={s}
                                            sampleChange={deleteSample} >
                                        </Sample>
                                    )}
                                </tbody>
                            </Table>
                        </Form.Group>
                        <AddSample sample={sample} setSample={setSample} addSample={addSample} ></AddSample>
                        <AddTestGroup addingAlt={addingAlt}
                            setAddingAlt={setAddingAlt}
                            addingTest={addingTest}
                            setAddingTest={setAddingTest}
                            setTestForAlternativeTests={setTestForAlternativeTests}
                            testForAlternativeTests={testForAlternativeTests}
                            tests={tests}
                            tableWidth={tableWidth}
                            cellWidth={cellWidth}
                            testForCase={testForCase}
                            setTestForCase={setTestForCase}
                            addAlternativeTestToTestForCase={addAlternativeTestToTestForCase}
                            addTestForCaseToTestGroup={addTestForCaseToTestGroup}
                            testGroup={testGroup}
                            addTestGroup={addTestGroup}
                        ></AddTestGroup>
                        {testGroups.map((testGroup, i) =>
                            <TestGroup key={i}
                                testgroup={testGroup}
                                index={i}
                                removeTestGroup={removeTestGroup}
                            >
                            </TestGroup>
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