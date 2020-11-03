import React, { useState } from 'react'
import Samples from './Samples.js'
import AddSample from './AddSample.js'
import TestGroup from './TestGroup.js'
import SelectBacterium from './components/SelectBaterium.js'
import AddTestGroup from './AddTestGroup.js'
import Name from './components/Name.js'
import { useDispatch, useSelector } from 'react-redux'
import { addCase } from '../../reducers/caseReducer'
import { Modal, Button, Form } from 'react-bootstrap'
import Notification from '../Notification.js'
import * as Yup from 'yup'
import { Formik } from 'formik'
import { updateCase } from '../../reducers/caseReducer'


const CaseForm = ({ caseToEdit }) => {

    /* initial parameters */
    const cases = useSelector(state => state.case)
    const bacteria = useSelector(state => state.bacteria)?.sort((bacterium1, bacterium2) => bacterium1.name.localeCompare(bacterium2.name))
    const user = useSelector(state => state.user)
    const tests = useSelector(state => state.test)?.sort((test1, test2) => test1.name.localeCompare(test2.name))
    /* initial parameters end*/

    /* parameters for style */
    const tableWidth = {
        tableLayout: 'fixed',
        width: '100%'
    }

    const cellWidth = {
        width: '100%'
    }
    const borderStyle = { borderStyle: 'solid', borderColor: 'black', borderWidth: 'thin' }
    const marginStyle = { margin: '10px' }
    /* parameters for style end*/

    /* states */
    const [name, setName] = useState(caseToEdit ? caseToEdit.name : '')
    const [bacteriumId, setBacteriumId] = useState(caseToEdit ? caseToEdit.bacterium ? caseToEdit.bacterium.id : '' : '')
    const [anamnesis, setAnamnesis] = useState(caseToEdit ? caseToEdit.anamnesis : '')
    const [completionText, setCompletionText] = useState(caseToEdit ? caseToEdit.completionText : '')
    const INITIAL_STATE = {
        id: '',
        image: undefined,
    }
    const [completionImage, setCompletionImage] = useState(INITIAL_STATE)
    const [deleteEndImage, setDeleteEndImage] = useState(false)
    const [img, setImg] = useState(caseToEdit ? caseToEdit.completionImage ? true : false : false)
    const [sample, setSample] = useState({ description: '', rightAnswer: false })
    const [samples, setSamples] = useState(caseToEdit ? caseToEdit.samples : [])
    const [addingAlt, setAddingAlt] = useState(false)
    const [addingTest, setAddingTest] = useState(false)
    const [test, setTest] = useState({ name: '', testId: '', positive: false })
    const [testForCase, setTestForCase] = useState({ isRequired: false, tests: [] })
    const [testGroup, setTestGroup] = useState([])
    const [testGroups, setTestGroups] = useState(caseToEdit ? caseToEdit.testGroups : [])
    const [addedTests, setAddedTests] = useState([])
    /* states end*/

    /* modal */
    const [show, setShow] = useState(false)
    const handleShow = () => setShow(true)
    const handleClose = () => {
        setShow(false)
        setAddingAlt(false)
        if (!caseToEdit) {
            resetCaseForm()
        }
    }
    /* modal end */

    const dispatch = useDispatch()

    /* schema for validation */
    const CaseSchema = Yup.object().shape({
        name: Yup.string()
            .min(2, 'Nimi on liian lyhyt.')
            .max(50, 'Nimi on liian pitkä')
            .required('Pakollinen kenttä.')
            .test('unique', 'Nimen tulee olla uniikki', function (name) {
                if (caseToEdit) {
                    if (name === caseToEdit.name) {
                        return true
                    }
                }
                if (cases.map(c => c.name).includes(name)) {
                    return false
                }
                return true
            }),
        bacteriumId: Yup.string()
            .required('Valitse bakteeri'),
        sample: Yup.string()
            .test('unique', 'Näyte on jo lisätty listaan', function (sample) {
                if (sample === '') {
                    return true
                }
                if (samples.map(s => s.description).includes(sample)) {
                    return false
                }
                return true
            }),
        test: Yup.string()
            .test('unique', 'Testi on jo lisätty', function (test) {
                if (!test) {
                    return true
                }
                if (addedTests.includes(JSON.parse(test).id)) {
                    return false
                }
                return true
            })
    })
    /* schema for validation end */

    /* form control */
    const onSuccess = () => {
        if (caseToEdit) {
            saveUpdatedCase()
        } else {
            addNewCase()
        }
    }

    const saveUpdatedCase = () => {
        const id = caseToEdit.id
        dispatch(updateCase(id, name,
            bacteriumId, anamnesis, completionText, completionImage, samples,
            testGroups, deleteEndImage, user.token, handleClose))
    }

    const addNewCase = () => {
        dispatch(addCase(name, bacteriumId, anamnesis, completionText, completionImage, samples, testGroups, user.token, handleClose))
    }

    const resetCaseForm = () => {
        setName('')
        setBacteriumId('')
        setAnamnesis('')
        setCompletionText('')
        setCompletionImage(INITIAL_STATE)
        setSample({ description: '', rightAnswer: false })
        setSamples([])
        setTest({ name: '', testId: '', positive: false })
        setTestForCase({ isRequired: false, tests: [] })
        setTestGroup([])
        setTestGroups([])
        setAddingAlt(false)
        setAddingTest(false)
        document.querySelectorAll('input[type=checkbox]').forEach(el => el.checked = false)

    }
    /* form control end */

    /* sample control */
    const deleteSample = (sampleToDelete) => setSamples(samples.filter(s => s.description !== sampleToDelete.description))
    const addSample = (description, rightAnswer, onChange) => {
        if (description !== '') {
            if (!samples.map(sample => sample.description).includes(description)) {
                setSamples(samples.concat({ description, rightAnswer }))
                setSample({
                    description: '',
                    rightAnswer: false
                })
                onChange('sample', '')
            }
        }
    }
    /* sample control end */

    /* testgroup control */
    const removeTestGroup = (tg) => {
        setTestGroups(testGroups.filter(testgroup => testgroup !== tg))
    }

    const addTestGroup = () => {
        if (testGroup.length > 0) {
            setTestGroups([...testGroups, testGroup])
            setTestGroup([])
            setAddingAlt(false)
            setAddingTest(false)
        }
    }

    const addTestToTestGroup = () => {
        setTest({ name: '', testId: '', positive: false })
        setTestGroup([...testGroup, testForCase])
        setTestForCase({ isRequired: false, tests: [] })
        setAddingAlt(false)
        setAddingTest(false)
    }

    const addTest = (onChange) => {
        if (!addedTests.includes(test.testId)) {
            setTestForCase({ ...testForCase, tests: testForCase.tests.concat(test) })
            setAddedTests([...addedTests, test.testId])
            setAddingTest(true)
            setAddingAlt(false)
            setTest({ name: '', testId: '', positive: false })
            onChange('test', '')
        }
    }
    /* testgroup control end */

    /* image */
    const handleCompletionImageChange = (event) => {
        setCompletionImage(event.target.files[0])
    }
    /* image end */

    const testGroupSwitch = (a, b) => {
        let newTestGroups = testGroups.slice()
        newTestGroups[a] = testGroups[b]
        newTestGroups[b] = testGroups[a]
        setTestGroups(newTestGroups)
    }

    return (
        <div>
            <Button id={caseToEdit ? 'caseEditButton' : 'caseModalButton'} style={{ float: 'right', margin: '2px' }} variant='primary' onClick={handleShow}>
                {caseToEdit ? 'Muokkaa' : 'Luo uusi tapaus'}
            </Button>
            <Modal show={show} size='xl' scrollable='true' onHide={handleClose} backdrop='static'>
                <Modal.Header closeButton>{caseToEdit ? 'Muokkaa' : 'Luo uusi tapaus'}</Modal.Header>
                <Modal.Body>
                    <Notification></Notification>
                    <Formik
                        validationSchema={CaseSchema}
                        onSubmit={onSuccess}
                        initialValues={{
                            name: name,
                            bacteriumId: bacteriumId,
                            sample: '',
                            test: ''
                        }}
                    >
                        {({
                            handleSubmit,
                            values,
                            errors,
                            setFieldValue,
                            touched
                        }) => {
                            return (
                                <Form noValidate onSubmit={handleSubmit}>
                                    <Name
                                        name={name}
                                        setName={setName}
                                        onChange={setFieldValue}
                                        error={errors.name}
                                        touched={touched.name}
                                    ></Name>

                                    <SelectBacterium
                                        bacteriumId={bacteriumId}
                                        setBacteriumId={setBacteriumId}
                                        bacteria={bacteria}
                                        onChange={setFieldValue}
                                        error={errors.bacteriumId}
                                        touched={touched.bacteriumId}
                                    ></SelectBacterium>

                                    <Form.Group controlId='anamnesis'>
                                        <Form.Label>Anamneesi</Form.Label>
                                        <Form.Control
                                            as='textarea'
                                            rows='3'
                                            value={anamnesis}
                                            onChange={(event) => setAnamnesis(event.target.value)}
                                        />
                                    </Form.Group>

                                    <Form.Group controlId='completionText'>
                                        <Form.Label>Lopputeksti</Form.Label>
                                        <Form.Control
                                            as='textarea'
                                            rows='3' value={completionText}
                                            onChange={(event) => setCompletionText(event.target.value)}
                                        />
                                    </Form.Group>

                                    {caseToEdit ?

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
                                        </Form.Group> :
                                        <Form.Group controlId='completionImage'>
                                            <Form.Label>Loppukuva</Form.Label>
                                            <Form.Control
                                                name='completionImage'
                                                type='file' value={completionImage.image}
                                                onChange={handleCompletionImageChange} />
                                        </Form.Group>
                                    }

                                    <Samples samples={samples}
                                        deleteSample={deleteSample}></Samples>
                                    <AddSample
                                        sample={sample}
                                        setSample={setSample}
                                        addSample={addSample}
                                        error={errors.sample}
                                        onChange={setFieldValue}
                                    ></AddSample>

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
                                        onChange={setFieldValue}
                                        value={values.test}
                                        error={errors.test}
                                        touched={touched.test}
                                    ></AddTestGroup>
                                    {testGroups.map((testGroup, i) =>
                                        <TestGroup key={i}
                                            testgroup={testGroup}
                                            index={i}
                                            removeTestGroup={removeTestGroup}
                                            testGroupsSize={testGroups.length}
                                            testGroupSwitch={testGroupSwitch}
                                        >
                                        </TestGroup>
                                    )}

                                    {caseToEdit ? <Button id="saveEdit" variant="success" type="submit">
                                        Tallenna muutokset
                                    </Button> : <Button
                                            variant='success'
                                            type='submit'
                                            id='addCase'>
                                            Tallenna tapaus
                                    </Button>}

                                    { Object.keys(errors).length > 0 ?
                                        <p style={{ color: 'red' }}>Tapausta ei voida lisätä, tarkista lisäämäsi syötteet.</p>
                                        : null
                                    }

                                </Form>
                            )
                        }}
                    </Formik>
                </Modal.Body>
            </Modal>
        </div>
    )
}

export default CaseForm
