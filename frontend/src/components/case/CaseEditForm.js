import React, { useState } from 'react'
import Sample from './Sample.js'
import TestGroup from './TestGroup.js'
import AddTestGroup from './AddTestGroup.js'
import AddSample from './AddSample.js'
import { useSelector, useDispatch } from 'react-redux'
import { Modal, Button, Form, Table, ListGroup } from 'react-bootstrap'
import { updateCase } from '../../reducers/caseReducer'
import { setNotification } from '../../reducers/notificationReducer'


const CaseEditForm = ({ caseToEdit }) => {
    /* Modal config */
    const handleShow = () => setShow(true)
    const handleClose = () => setShow(false)
    const [show, setShow] = useState(false)

    const tableWidth = {
        tableLayout: 'fixed',
        width: '100%'
    }

    const cellWidth = {
        width: '100%'
    }
    /*end of modal config*/

    const user = useSelector(state => state.user)
    const dispatch = useDispatch()

    const saveUpdatedCase = (event) => {
        event.preventDefault()
        const token = user.token
        const id = caseToEdit.id
        dispatch(updateCase(id, caseName,
            bacterium, caseAnamnesis, completionImage, samples,
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
    const INITIAL_STATE = {
        id: '',
        image: undefined,
    }
    const [completionImage, setCompletionImage] = useState(INITIAL_STATE)
    const [deleteEndImage, setDeleteEndImage] = useState(false)
    const [img, setImg] = useState(caseToEdit.completionImage ? true : false)
    const borderStyle = { borderStyle: 'solid', borderColor: 'black', borderWidth: 'thin' }
    const marginStyle = { margin: '10px' }
    /*image control end*/

    /* samples control*/
    const [sample, setSample] = useState({ description: '', rightAnswer: false })
    const [samples, setSamples] = useState(caseToEdit.samples)
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
    /* samples control end */

    /* testgroup control */
    const [addingAlt, setAddingAlt] = useState(false)
    const [addingTest, setAddingTest] = useState(false)
    const tests = useSelector(state => state.test)?.sort((test1, test2) => test1.name.localeCompare(test2.name))
    const [test, setTest] = useState({ name: '', testId: '', positive: false })
    const [testForCase, setTestForCase] = useState({ isRequired: false, tests: [] })
    const [testGroup, setTestGroup] = useState([])
    const [testGroups, setTestGroups] = useState(caseToEdit.testGroups)

    const removeTestGroup = (tg) => {
        setTestGroups(testGroups.filter(testgroup => testgroup !== tg))
    }

    const addTestGroup = () => {
        setTestGroups([...testGroups, testGroup])
        setTestGroup([])
        setAddingAlt(false)
        setAddingTest(false)
    }

    const addTestToTestGroup = () => {
        setTest({ name: '', testId: '', positive: false })
        setTestGroup([...testGroup, testForCase])
        setTestForCase({ isRequired: false, tests: [] })
        setAddingAlt(false)
        setAddingTest(false)
    }

    const addTest = () => {
        console.log(test)
        setTestForCase({ ...testForCase, tests: testForCase.tests.concat(test) })
        setAddingAlt(false)
        setTest({ name: '', testId: '', positive: false })
    }
    /* testgroup control end */
    return (<div>
        <Button id="caseEditButton" variant="primary" onClick={handleShow}>
            Muokkaa
        </Button>
        <Modal show={show} size="lg" onHide={handleClose} >
            <Modal.Header closeButton>Muokkaat tapausta {caseToEdit.name}</Modal.Header>
            <Modal.Body>
                <Form onSubmit={saveUpdatedCase} >

                    <Form.Label>Nimi:</Form.Label><br></br>
                    <Form.Control id="editName" onChange={handleCaseNameChange} defaultValue={caseToEdit.name} /><br></br>

                    <Form.Label>Anamneesi:</Form.Label><br></br>
                    <Form.Control onChange={handleAnamnesisChange} defaultValue={caseToEdit.anamnesis} /><br></br>

                    <Form.Label>Bakteeri:</Form.Label><br></br>
                    <Form.Control as="select" onChange={handleBacteriumChange} value={bacterium.id}>
                        {bacteria.map(bac =>
                            <option key={bac.id} value={bac.id}>{bac.name}</option>
                        )}
                    </Form.Control><br></br>

                    <Form.Group controlId="editCompletionImage">
                        <Form.Label style={marginStyle}>Loppukuva</Form.Label>
                        {img ?
                            <p style={borderStyle}>Loppukuva on annettu</p>
                            : <></>
                        }
                        <Form.Control
                            style={marginStyle}
                            name='editCompletionImg'
                            value={completionImage.image}
                            type='file'
                            onChange={({ target }) => { setCompletionImage(target.files[0]); setImg(true); setDeleteEndImage(false) }}
                        />
                        <Button style={marginStyle} id='deleteImage' onClick={() => { setImg(false); setDeleteEndImage(true) }}>Poista loppukuva
                            <svg width="1em" height="1em" viewBox="0 0 16 16" className="bi bi-trash" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z" />
                                <path fillRule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4L4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z" />
                            </svg>
                        </Button>
                    </Form.Group>

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

                    <AddSample sample={sample} setSample={setSample} addSample={addSample} ></AddSample>
                    <AddTestGroup addingAlt={addingAlt}
                        setAddingAlt={setAddingAlt}
                        addingTest={addingTest}
                        setAddingTest={setAddingTest}
                        setTest={setTest}
                        test={test}
                        tests={tests}
                        tableWidth={tableWidth}
                        cellWidth={cellWidth}
                        testForCase={testForCase}
                        setTestForCase={setTestForCase}
                        addTest={addTest}
                        addTestToTestGroup={addTestToTestGroup}
                        testGroup={testGroup}
                        addTestGroup={addTestGroup}
                    ></AddTestGroup>
                   
                    <ListGroup>
                        <Form.Label> Testiryhmät</Form.Label>
                        {testGroups.map((tg, i) =>
                            <TestGroup key={i}
                                testgroup={tg}
                                index={i}
                                removeTestGroup={removeTestGroup}
                            >
                            </TestGroup>
                        )}
                    </ListGroup>
                    
                     <Button id="saveEdit" variant="primary" type="submit">
                        Tallenna
                    </Button>
                </Form>
            </Modal.Body>
        </Modal>
    </div>)

}

export default CaseEditForm