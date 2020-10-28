import React, { useState } from 'react'
import Samples from './Samples.js'
import AddSample from './AddSample.js'
import TestGroup from './TestGroup.js'
import SelectBacterium from './SelectBaterium.js'
import AddTestGroup from './AddTestGroup.js'
import { useDispatch, useSelector } from 'react-redux'
import { addCase } from '../../reducers/caseReducer'
import { Modal, Button, Form } from 'react-bootstrap'
import Notification from '../Notification.js'
import { Formik } from 'formik';
import * as Yup from 'yup';




const CaseForm = () => {
    const cases = useSelector(state => state.case)

    const CaseSchema = Yup.object().shape({
        name: Yup.string()
            .min(2, 'Nimi on liian lyhyt.')
            .max(50, 'Nimi on liian pitkä')
            .required('Pakollinen kenttä.')
            .test('unique', 'Nimen tulee olla uniikki', function (name) {
                if (cases.map(c => c.name).includes(name)) {
                    return false
                }
                return true
            }),
        bacteriumId: Yup.string()
            .required('Valitse bakteeri'),
        sample: Yup.string()
            .test('unique', 'Näyte on jo lisätty listaan', function (sample) {
                if(sample===""){
                    return true
                }
                if (samples.map(s => s.description).includes(sample)) {
                    return false
                }
                return true
            })

    })

    const onSuccess = (values) => {
        console.log(values)
        addNewCase(values.name, values.bacteriumId)
    };

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
    const user = useSelector(state => state.user)

    const [anamnesis, setAnamnesis] = useState('')
    const [completionImage, setCompletionImage] = useState(INITIAL_STATE)
    const [completionText, setCompletionText] = useState('')

    const dispatch = useDispatch()

    const [validated, setValidated] = useState(false)


    const addNewCase = (name, bacteriumId) => {
        dispatch(addCase(name, bacteriumId, anamnesis, completionText, completionImage, samples, testGroups, user.token, resetCaseForm))
        handleClose()
    }

    const resetCaseForm = () => {
        setAnamnesis('')
        setCompletionText('')
        setCompletionImage(INITIAL_STATE)
        setSample({ description: '', rightAnswer: false })
        setSamples([])
        setTest({ name: '', testId: tests[0].id, positive: false })
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
        setValidated(false)
    }

    const [sample, setSample] = useState({ description: '', rightAnswer: false })
    const [samples, setSamples] = useState([])
    const deleteSample = (sampleToDelete) => setSamples(samples.filter(s => s.description !== sampleToDelete.description))
    const addSample = (description, rightAnswer) => {
        if (description !== '') {
            if (!samples.map(sample => sample.description).includes(description)) {

                setSamples(samples.concat({ description, rightAnswer }))
                setSample({
                    description: '',
                    rightAnswer: false
                })
            }
        }
    }

    /* testgroup control */
    const [addingAlt, setAddingAlt] = useState(false)
    const [addingTest, setAddingTest] = useState(false)
    const tests = useSelector(state => state.test)?.sort((test1, test2) => test1.name.localeCompare(test2.name))
    const [test, setTest] = useState({ name: '', testId: '', positive: false })
    const [testForCase, setTestForCase] = useState({ isRequired: false, tests: [] })
    const [testGroup, setTestGroup] = useState([])
    const [testGroups, setTestGroups] = useState([])

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
        setTestForCase({ ...testForCase, tests: testForCase.tests.concat(test) })
        setAddingAlt(false)
        setTest({ name: '', testId: '', positive: false })
    }
    /* testgroup control end */

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
                    <Notification></Notification>
                    <Formik
                        validationSchema={CaseSchema}
                        onSubmit={onSuccess}
                        initialValues={{
                            name: '',
                            bacteriumId: '',
                            sample: ''
                        }}
                    >
                        {({
                            handleSubmit,
                            handleChange,
                            values,
                            errors,
                            setFieldValue,
                            validateField,
                            touched
                        }) => {
                            return (
                                <Form noValidate onSubmit={handleSubmit}>

                                    <Form.Group controlId='name'>
                                        <Form.Label>Nimi</Form.Label>
                                        <Form.Control
                                            type="text"
                                            isInvalid={errors.name && touched.name}
                                            value={values.name}
                                            onChange={handleChange}
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            {errors.name}
                                        </Form.Control.Feedback>
                                    </Form.Group>

                                    <Form.Group controlId='bacterium'>
                                        <Form.Label>Bakteeri</Form.Label>
                                        <SelectBacterium onChange={setFieldValue}
                                            value={values.bacteriumId}
                                            error={errors.bacteriumId}
                                            bacteria={bacteria}
                                            touched={touched.bacteriumId}
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            {errors.bacteriumId}
                                        </Form.Control.Feedback>
                                    </Form.Group>

                                    <Form.Group controlId='anamnesis'>
                                        <Form.Label>Anamneesi</Form.Label>
                                        <Form.Control
                                            as='textarea'
                                            rows='3' value={anamnesis}
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

                                    <Form.Group controlId='completionImage'>
                                        <Form.Label>Loppukuva</Form.Label>
                                        <Form.Control
                                            name='completionImage'
                                            type='file' value={completionImage.image}
                                            onChange={handleCompletionImageChange} />
                                    </Form.Group>

                                    <Samples samples={samples}
                                        deleteSample={deleteSample}></Samples>
                                    <AddSample
                                        sample={sample}
                                        setSample={setSample}
                                        addSample={addSample}
                                        error={errors.sample}
                                        touched={touched.sample}
                                        validateField={validateField}
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
                                    ></AddTestGroup>
                                    {testGroups.map((testGroup, i) =>
                                        <TestGroup key={i}
                                            testgroup={testGroup}
                                            index={i}
                                            removeTestGroup={removeTestGroup}
                                        >
                                        </TestGroup>
                                    )}
                                    { validated ?
                                        <p style={{ color: 'red' }}>Tapausta ei voida lisätä, tarkista lisäämäsi syötteet.</p>
                                        : null
                                    }
                                    <Button
                                        variant='primary'
                                        type='submit'
                                        id='addCase'>
                                        Lisää tapaus
                        </Button>
                                </Form>
                            );
                        }}
                    </Formik>
                </Modal.Body>
            </Modal>
        </div>
    )
}

export default CaseForm
