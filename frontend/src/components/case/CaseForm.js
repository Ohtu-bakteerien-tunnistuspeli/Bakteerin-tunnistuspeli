import React, { useState, useEffect } from 'react'
import Samples from './components/Samples.js'
import AddSample from './components/AddSample.js'
import TestGroup from './components/TestGroup.js'
import SelectBacterium from './components/SelectBaterium.js'
import Name from './components/Name.js'
import { useDispatch, useSelector } from 'react-redux'
import { addCase } from '../../reducers/caseReducer'
import { Modal, Button, Form } from 'react-bootstrap'
import Notification from '../utility/Notification.js'
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
    const borderStyle = { borderStyle: 'solid', borderColor: 'black', borderWidth: 'thin' }
    const marginStyle = { margin: '10px' }
    /* parameters for style end*/

    /* states */
    const [name, setName] = useState('')
    const [bacteriumId, setBacteriumId] = useState('')
    const [anamnesis, setAnamnesis] = useState('')
    const [completionText, setCompletionText] = useState('')
    const INITIAL_STATE = {
        id: '',
        image: undefined,
    }
    const [completionImage, setCompletionImage] = useState(INITIAL_STATE)
    const [deleteEndImage, setDeleteEndImage] = useState(false)
    const [img, setImg] = useState(false)
    const [sample, setSample] = useState({ description: '', rightAnswer: false })
    const [samples, setSamples] = useState([])
    const [testGroups, setTestGroups] = useState([])
    const [addedTests, setAddedTests] = useState([])
    /* states end*/

    /* Initialize editform with */
    const initializeCase = (caseToEdit) => {
        setName(caseToEdit.name)
        setBacteriumId(caseToEdit.bacterium.id)
        setAnamnesis(caseToEdit.anamnesis)
        setCompletionText(caseToEdit.completionText)
        setSamples(caseToEdit.samples)
        setImg(caseToEdit.completionImage ? true : false)
        setTestGroups(caseToEdit.testGroups)
        setAddedTests(testsFromTestGroups)
    }

    /* modal */
    const [show, setShow] = useState(false)
    const handleShow = () => {
        setShow(true)
        if (caseToEdit) {
            initializeCase(caseToEdit)
        }
    }
    const handleClose = () => {
        setShow(false)
        if (!caseToEdit) {
            resetCaseForm()
        } else {
            resetCaseEditForm()
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
            .test('unique', 'Näyte on jo lisätty listaan', (sample) => {
                if (sample === '') {
                    return true
                }
                if (samples.map(s => s.description).includes(sample)) {
                    return false
                }
                return true
            }),
        test: Yup.string()
            .test('unique', 'Testi on jo lisätty', (test) => {
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

    const resetCaseEditForm = () => {
        setSample({ description: '', rightAnswer: false })
        setTestGroups([])
        setCompletionImage(INITIAL_STATE)
        document.querySelectorAll('input[type=checkbox]').forEach(el => el.checked = false)
    }
    const resetCaseForm = () => {
        setName('')
        setBacteriumId('')
        setAnamnesis('')
        setCompletionText('')
        setCompletionImage(INITIAL_STATE)
        setSample({ description: '', rightAnswer: false })
        setSamples([])
        setTestGroups([])
        setAddedTests([])
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
        let newTests = addedTests
        for (const testGroup of tg) {
            for (const test of testGroup.tests) {
                newTests = newTests.filter(testId => testId !== test.test.id)
            }
        }
        setAddedTests(newTests)
        setTestGroups(testGroups.filter(testgroup => testgroup !== tg))
    }

    const addTestGroup = () => {
        setTestGroups([...testGroups, []])
    }

    const addEmptyTestForCase = (testGroupIndex) => {
        let newTestGroups = testGroups.slice()
        newTestGroups[testGroupIndex].push({ tests: [], isRequired: false })
        setTestGroups(newTestGroups)
    }

    const removeTestForCase = (testGroupIndex, testForCaseIndex) => {
        let newTestGroups = testGroups.slice()
        let removedTests = []
        newTestGroups[testGroupIndex][testForCaseIndex].tests.forEach(test => removedTests.push(test.test.id))
        setAddedTests(addedTests.filter(testId => !removedTests.includes(testId)))
        newTestGroups[testGroupIndex] = newTestGroups[testGroupIndex].filter((testForCase, i) => i !== testForCaseIndex) //eslint-disable-line
        setTestGroups(newTestGroups)
    }

    const changeTestForCaseIsRequired = (testGroupIndex, testForCaseIndex) => {
        let newTestGroups = testGroups.slice()
        newTestGroups[testGroupIndex][testForCaseIndex].isRequired = !testGroups[testGroupIndex][testForCaseIndex].isRequired
        setTestGroups(newTestGroups)
    }

    const addTest = (testGroupIndex, testForCaseIndex, test) => {
        if (!addedTests.includes(test.id) && test.id) {
            let newTestGroups = testGroups.slice()
            newTestGroups[testGroupIndex][testForCaseIndex].tests.push({ test, positive: false })
            setTestGroups(newTestGroups)
            setAddedTests(addedTests.concat(test.id))
        }
    }

    const removeTest = (testGroupIndex, testForCaseIndex, testIndex) => {
        let newTestGroups = testGroups.slice()
        setAddedTests(addedTests.filter(testId => testId !== newTestGroups[testGroupIndex][testForCaseIndex].tests[testIndex].test.id))
        newTestGroups[testGroupIndex][testForCaseIndex].tests = newTestGroups[testGroupIndex][testForCaseIndex].tests.filter((test, i) => i !== testIndex) //eslint-disable-line
        setTestGroups(newTestGroups)
    }

    const changeTestPositive = (testGroupIndex, testForCaseIndex, testIndex) => {
        let newTestGroups = testGroups.slice()
        newTestGroups[testGroupIndex][testForCaseIndex].tests[testIndex].positive = !testGroups[testGroupIndex][testForCaseIndex].tests[testIndex].positive
        setTestGroups(newTestGroups)
    }

    const testsFromTestGroups = () => {
        const testIds = []

        for (const testGroup of caseToEdit.testGroups) {
            for (const testAlts of testGroup) {
                for (const t of testAlts.tests) {
                    testIds.push(t.test.id)
                }
            }
        }

        return testIds
    }

    useEffect(() => {
        setAddedTests(caseToEdit ? testsFromTestGroups : [])
        // eslint-disable-next-line
    }, [])
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
                            touched,
                            handleBlur
                        }) => {
                            return (
                                <Form noValidate onSubmit={handleSubmit}>
                                    <Name
                                        name={name}
                                        setName={setName}
                                        onChange={setFieldValue}
                                        error={errors.name}
                                        touched={touched.name}
                                        handleBlur={handleBlur}
                                    ></Name>

                                    <SelectBacterium
                                        bacteriumId={bacteriumId}
                                        setBacteriumId={setBacteriumId}
                                        bacteria={bacteria}
                                        onChange={setFieldValue}
                                        error={errors.bacteriumId}
                                        touched={touched.bacteriumId}
                                        handleBlur={handleBlur}
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
                                        handleBlur={handleBlur}
                                        touched={touched.sample}
                                    ></AddSample>

                                    {/*<AddTestGroup addingAlt={addingAlt}
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
                                        addedTests={addedTests}
                                        touched={touched.test}
                                ></AddTestGroup>*/}
                                    <Form.Label>Testiryhmät</Form.Label>
                                    {testGroups.map((testGroup, i) =>
                                        <TestGroup key={i}
                                            testgroup={testGroup}
                                            index={i}
                                            removeTestGroup={removeTestGroup}
                                            testGroupsSize={testGroups.length}
                                            testGroupSwitch={testGroupSwitch}
                                            addEmptyTestForCase={addEmptyTestForCase}
                                            removeTestForCase={removeTestForCase}
                                            changeTestForCaseIsRequired={changeTestForCaseIsRequired}
                                            addTest={addTest}
                                            removeTest={removeTest}
                                            changeTestPositive={changeTestPositive}
                                            tests={tests}
                                            addedTests={addedTests}
                                        />
                                    )}
                                    <Button id='addTestGroup' onClick={() => addTestGroup()} block>Lisää tyhjä testiryhmä</Button>
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
