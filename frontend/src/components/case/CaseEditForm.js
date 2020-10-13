import React, { useState } from 'react'
import Sample from './Sample.js'
import TestGroup from './TestGroup.js'
import AddTestGroup from './AddTestGroup.js'
import { useSelector, useDispatch } from 'react-redux'
import { Modal, Button, Form, Table, ListGroup } from 'react-bootstrap'
import { updateCase } from '../../reducers/caseReducer'


const CaseEditForm = ({ caseToEdit }) => {
    /* Modal config */
    const handleShow = () => setShow(true)
    const handleClose = () => setShow(false)
    const [show, setShow] = useState(false)
    /*end of modal config*/

    const user = useSelector(state => state.user)
    const dispatch = useDispatch()

    const saveUpdatedCase = (event) => {
        event.preventDefault()
        dispatch(updateCase(c.id, caseName, bacterium, caseAnamnesis, c.completionImage, samples, testGroups, deleteEndImage, user.token))

    }

    /* case name control*/
    const [caseName, setCaseName] = useState(caseToEdit.name)
    const handleCaseNameChange = (event) => setCaseName(event.target.value)
    /* case name control end */

    /* case anamnesis control */
    const [caseAnamnesis, setCaseAnamnesis] = useState(caseToEdit.anamnesis)
    const handleAnamnesisChange = (event) => setCaseAnamnesis(event.target.value)
    /*case anamnesis control end */

    /*bacterium control*/
    const bacteria = useSelector(state => state.bacteria)
        .sort((bacterium1, bacterium2) =>
            bacterium1.name.localeCompare(bacterium2.name))

    const [bacterium, setBacterium] = useState(caseToEdit.bacterium)
    const handleBacteriumChange = (event) => setBacterium(bacteria.find(bac => bac.id === event.target.value))
    /* bacterium control end */

    /*Image control */
    const [deleteEndImage] = useState(false)
    /*image control end*/

    /* samples control*/
    const [samples, setSamples] = useState(c.samples)
    const deleteSample = (sample2) => {
        setSamples(samples.filter(s => s.description !== sample2.description))
    }
    const [newSampleName, setNewSampleName] = useState('')
    const [newSampleRightAnswer, setNewSampleRightAnswer] = useState(false)
    const handleNewSampleName = (event) => setNewSampleName(event.target.value)
    const handleNewSampleRightAnswer = (event) => setNewSampleRightAnswer(!newSampleRightAnswer)

    const addSample = (event) => {
        event.preventDefault()
        const newSample = {
            description: sampleDescription,
            rightAnswer: sampleRightAnswer
        }
        setSamples(samples.concat(newSample))
        setSampleDescription('')
        setSampleRightAnswer(false)

    }
    /* samples control end */

    /* testgroup control */
    const tests = useSelector(state => state.test)?.sort((test1, test2) => test1.name.localeCompare(test2.name))
    const [testForAlternativeTests, setTestForAlternativeTests] = useState({ name: tests[0].name, testId: tests[0].id, positive: false })
    const [testForCase, setTestForCase] = useState({ isRequired: false, tests: [] })
    const [testGroup, setTestGroup] = useState([])
    const [testGroups, setTestGroups] = useState(c.testGroups)

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



    const removeTestGroup = (tg) => {
        setTestGroups(testGroups.filter(testgroup => testgroup !== tg))
    }
    /* testgroup control end */
    return (<div>
        <Button variant="primary" onClick={handleShow}>
            Muokkaa
        </Button>
        <Modal show={show} size="lg" onHide={handleClose} >
            <Modal.Header closeButton>Muokkaat tapausta "{c.name}"</Modal.Header>
            <Modal.Body>
                <Form onSubmit={updateCase2} >

                    <Form.Label>Nimi:</Form.Label><br></br>
                    <Form.Control onChange={handleCaseNameChange} defaultValue={c.name} /><br></br>

                    <Form.Label>Anamneesi:</Form.Label><br></br>
                    <Form.Control onChange={handleAnamnesisChange} defaultValue={c.anamnesis} /><br></br>

                    <Form.Label>Bakteeri:</Form.Label><br></br>
                    <Form.Control as="select" onChange={handleBacteriumChange} value={bacterium.id}>
                        {bacteria.map(bac =>
                            <option key={bac.id} value={bac.id}>{bac.name}</option>
                        )}
                    </Form.Control><br></br>

                    <Form.Label>Näytevaihtoehdot</Form.Label><br></br>
                    {samples.map(s =>
                        <Sample key={s.description}
                            sample={s}
                            sampleChange={deleteSample} >
                        </Sample>
                    )}
                    <Form.Control onChange={handleNewSampleName}
                        placeholder="Näytteen kuvaus"
                        value={newSampleName} />
                    <Form.Check onChange={handleNewSampleRightAnswer}
                        type="checkbox"
                        label="Oikea vastaus"
                        checked={newSampleRightAnswer} />
                    <Button onClick={addSample}>Lisää näytevaihtoehto</Button><br></br>

                    <Form.Label> Testiryhmät</Form.Label>
                    {testGroups.map((tg, i) =>
                        <TestGroup key={i}
                            testgroup={tg}
                            index={i}
                            removeTestGroup={removeTestGroup}
                        >
                        </TestGroup>
                    )}
                    <Form.Label>Lisää Testiryhmä</Form.Label>
                    <AddTestGroup
                        testForAlternativeTests={testForAlternativeTests}
                        testForCase={testForCase}
                        addAlternativeTestToTestForCase={addAlternativeTestToTestForCase}
                        tests={tests}
                        setTestForCase={setTestForCase}
                        testGroup={testGroup}
                        addTestGroup={addTestGroup}
                        addTestForCaseToTestGroup={addTestForCaseToTestGroup}
                        setTestForAlternativeTests={setTestForAlternativeTests}
                    ></AddTestGroup>
                    <Button variant="primary" type="submit">
                        Tallenna
                    </Button>
                </Form>
            </Modal.Body>
        </Modal>
    </div>)

}

export default CaseEditForm