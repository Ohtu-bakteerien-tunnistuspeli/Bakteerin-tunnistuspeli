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
        var token = user.token
        var id = caseToEdit.id
        dispatch(updateCase(id, caseName, 
            bacterium, caseAnamnesis, caseToEdit.completionImage, samples, 
            testGroups, deleteEndImage, token))
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
    const [samples, setSamples] = useState(caseToEdit.samples)
    const deleteSample = (sampleToDelete) => setSamples(samples.filter(s => s.description !== sampleToDelete.description))

    const [sampleDescription, setSampleDescription] = useState('')
    const [sampleRightAnswer, setSampleRightAnswer] = useState(false)
    const handleSampleName = (event) => setSampleDescription(event.target.value)
    const handleSampleRightAnswer = (event) => setSampleRightAnswer(!sampleRightAnswer)

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

    const [testIdForCase, setTestIdForCase] = useState("")
    const [testBools, setTestBools] = useState({ isRequired: false, positive: false, alternativeTests: false })
    const [testGroup, setTestGroup] = useState([])
    const [testGroups, setTestGroups] = useState(caseToEdit.testGroups)
    const addTestGroup = () => {
        setTestGroups([...testGroups, testGroup])
        setTestGroup([])
    }
    const handleTestChange = (event) => setTestIdForCase(event.target.value)
    const handleTestAdd = () => {
        setTestGroup([...testGroup,
        {
            testId: testIdForCase,
            isRequired: testBools.isRequired,
            positive: testBools.positive,
            alternativeTests: testBools.alternativeTests
        }])
        setTestBools({ isRequired: false, positive: false, alternativeTests: false })
    }

    const removeTestGroup = (tg) => {
        setTestGroups(testGroups.filter(testgroup => testgroup !== tg))
    }
    /* testgroup control end */

    return (
    <div>
        <Button variant="primary" onClick={handleShow}>
            Muokkaa
        </Button>
        <Modal show={show} size="lg" onHide={handleClose} >
            <Modal.Header closeButton>Muokkaat tapausta "{caseToEdit.name}"</Modal.Header>
            <Modal.Body>
                <Form onSubmit={saveUpdatedCase} >

                    <Form.Label>Nimi:</Form.Label><br></br>
                    <Form.Control onChange={handleCaseNameChange} defaultValue={caseToEdit.name} /><br></br>

                    <Form.Label>Anamneesi:</Form.Label><br></br>
                    <Form.Control as='textarea' onChange={handleAnamnesisChange} defaultValue={caseToEdit.anamnesis} /><br></br>

                    <Form.Label>Bakteeri:</Form.Label><br></br>
                    <Form.Control as="select" onChange={handleBacteriumChange} value={bacterium.id}>
                        {bacteria.map(bac =>
                            <option key={bac.id} value={bac.id}>{bac.name}</option>
                        )}
                    </Form.Control><br></br>

                    <Form.Label>Näytevaihtoehdot: </Form.Label><br></br>
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
                    
                    <Form.Control onChange={handleSampleName}
                        placeholder="Näytteen kuvaus"
                        value={sampleDescription} />
                    <Form.Check onChange={handleSampleRightAnswer}
                        type="checkbox"
                        label="Oikea vastaus"
                        checked={sampleRightAnswer} />
                    <Button onClick={addSample}>Lisää näytevaihtoehto</Button><br></br>
                    <br></br>
                    <ListGroup>
                    <Form.Label>Testiryhmät:</Form.Label>
                    {testGroups.map((tg, i) =>
                        <TestGroup key={i}
                            testgroup={tg}
                            index={i}
                            removeTestGroup={removeTestGroup}
                            tests={tests}
                        >
                        </TestGroup>
                    )}
                    </ListGroup>
                    <Form.Label>Lisää testiryhmä:</Form.Label>
                    <AddTestGroup
                        setCaseTest={handleTestChange}
                        setTestBools={setTestBools}
                        testBools={testBools}
                        tests={tests}
                        handleTestAdd={handleTestAdd}
                        testGroup={testGroup}
                        addTestGroup={addTestGroup}
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