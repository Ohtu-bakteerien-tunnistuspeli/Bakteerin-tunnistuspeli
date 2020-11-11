import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { addTest } from '../../reducers/testReducer'
import { Modal, Button, Form, Image } from 'react-bootstrap'
import BacteriaSpecificImages from './BacteriaSpecificImages'
import Name from './components/Name.js'
import Type from './components/Type.js'
import DeleteButton from '../utility/DeleteButton.js'
import AddImage from './components/AddImage.js'
import { INITIAL_STATE, marginStyle } from './utility'
import { deleteTest, updateTest } from '../../reducers/testReducer'
import * as Yup from 'yup'
import { Formik } from 'formik'


const TestForm = ({ testToEdit }) => {

    /* style parameters */
    const style = { margin: '10px', float: 'right' }
    /* style parameters end */

    /* initial parameters */
    const tests = useSelector(state => state.test)
    const bacteria = useSelector(state => state.bacteria)?.sort((bacterium1, bacterium2) => bacterium1.name.localeCompare(bacterium2.name))
    const user = useSelector(state => state.user)
    const dispatch = useDispatch()
    /* initial parameters end */

    /* states */
    const [testName, setTestName] = useState(testToEdit ? testToEdit.name : '')
    const [testType, setTestType] = useState(testToEdit ? testToEdit.type : '')
    const [bacterium, setBacterium] = useState('')
    const [controlImage, setControlImage] = useState(INITIAL_STATE)
    const [positiveResultImage, setPositiveResultImage] = useState(INITIAL_STATE)
    const [negativeImage, setNegativeImage] = useState(INITIAL_STATE)
    const [bacteriaSpecificImages, setBacteriaImages] = useState(testToEdit && testToEdit.bacteriaSpecificImages.length > 0 ? testToEdit.bacteriaSpecificImages : [])
    const [bacteriaSpecificImage, setBacteriaImage] = useState(INITIAL_STATE)
    const [deletePhotos, setDeletePhotos] = useState({ ctrl: false, pos: false, neg: false })
    const [deleteSpecifics, setDeleteSpecifics] = useState([])
    const [pos, setPos] = useState(testToEdit ? testToEdit.positiveResultImage ? true : false : false)
    const [neg, setNeg] = useState(testToEdit ? (testToEdit.negativeResultImage ? true : false) : false)
    const [ctrl, setCtrl] = useState(testToEdit ? testToEdit.controlImage ? true : false : false)
    const [imgPreviewCtrl, setImgPreviewCtrl] = useState('')
    const [imgPreviewNeg, setImgPreviewNeg] = useState('')
    const [imgPreviewPos, setImgPreviewPos] = useState('')
    const [addedBacteriaImage, setAddedBacteriaImage] = useState(testToEdit ? testToEdit.bacteriaSpecificImages.map(bacImg => bacImg.bacterium.name) : [])
    /* states end */

    /* modal control */
    const [show, setShow] = useState(false)
    const handleShow = () => setShow(true)

    const handleClose = () => {
        resetTestForm()
        setShow(false)
    }
    /* modal control end */

    /* form control */
    const addTests = () => {
        dispatch(addTest(testName,
            testType,
            controlImage,
            positiveResultImage,
            negativeImage,
            bacteriaSpecificImages,
            user.token, handleClose))
    }

    const resetTestForm = () => {
        setBacteriaImages(testToEdit && testToEdit.bacteriaSpecificImages.length > 0 ? testToEdit.bacteriaSpecificImages : [])
        setTestName(testToEdit ? testToEdit.name : '')
        setTestType(testToEdit ? testToEdit.type : '')
        setBacterium('')
        setControlImage(INITIAL_STATE)
        setPositiveResultImage(INITIAL_STATE)
        setNegativeImage(INITIAL_STATE)
        setBacteriaImage(INITIAL_STATE)
        setDeletePhotos({ ctrl: false, pos: false, neg: false })
        setDeleteSpecifics([])
        setPos(testToEdit ? testToEdit.positiveResultImage ? true : false : false)
        setNeg(testToEdit ? (testToEdit.negativeResultImage ? true : false) : false)
        setCtrl(testToEdit ? testToEdit.controlImage ? true : false : false)
        setImgPreviewCtrl('')
        setImgPreviewNeg('')
        setImgPreviewPos('')
        setAddedBacteriaImage(testToEdit ? testToEdit.bacteriaSpecificImages.map(bacImg => bacImg.bacterium.name) : [])
    }

    const removeTest = () => {
        dispatch(deleteTest(testToEdit.id, user.token))
    }

    const editTest = () => {
        const photosToDelete = deletePhotos
        const token = user.token
        const id = testToEdit.id
        dispatch(updateTest(id, testName,
            testType, controlImage,
            positiveResultImage, negativeImage,
            bacteriaSpecificImages,
            photosToDelete,
            deleteSpecifics,
            token, handleClose, setDeletePhotos, setDeleteSpecifics))
    }
    /* form control end */


    /* schema for validation */
    const TestSchema = Yup.object().shape({
        testName: Yup.string()
            .min(2, 'Nimen tulee olla vähintään 2 merkkiä pitkä.')
            .max(100, 'Nimen tulee olla enintään 100 merkkiä pitkä.')
            .required('Pakollinen kenttä.')
            .test('unique', 'Nimen tulee olla uniikki', function (name) {
                if (testToEdit) {
                    if (name === testToEdit.name) {
                        return true
                    }
                }
                if (tests.map(c => c.name).includes(name)) {
                    return false
                }
                return true
            }),
        testType: Yup.string()
            .required('Pakollinen kenttä'),
        bacteriumName: Yup.string()
            .test('unique', 'bakteerille on jo lisätty kuva', function (bacteriumName) {
                if (!bacteriumName || bacteriumName === '') {
                    return true
                }
                if (addedBacteriaImage.includes(bacteriumName)) {
                    return false
                }
                return true
            })

    })
    /* schema for validation end */

    const onSuccess = () => {
        if (testToEdit) {
            editTest()
        } else {
            addTests()
        }
    }

    const addBacteriumSpecificImage = () => {
        if (!bacterium) {
            return
        }
        if (bacteriaSpecificImage.image !== 'undefined' && bacteriaSpecificImage.bacterium !== '') {
            if (bacteriaSpecificImage.name !== '' && bacteriaSpecificImage.name !== 'default' && bacterium !== 'default') {
                var newFile = null
                if (bacteriaSpecificImages === undefined || bacteriaSpecificImage.name === 'undefined') {
                    var file = bacteriaSpecificImage
                    var blob = file.slice(0, file.size, file.type)
                    newFile = new File([blob], bacterium, { type: file.type })
                    setBacteriaImage(newFile)
                }
                if (!newFile) {
                    newFile = bacteriaSpecificImage
                }
                setBacteriaImages(bacteriaSpecificImages.concat(newFile))
                setDeleteSpecifics(deleteSpecifics.filter(img => img !== newFile.name))
                setBacteriaImage(INITIAL_STATE)
                setBacterium('')
                setAddedBacteriaImage(addedBacteriaImage.concat(bacterium))
            }
        }
    }

    const removeBacteriaSpecificImage = (image) => {
        let name
        image.name ? name = image.name : name = image.bacterium.name
        setDeleteSpecifics(deleteSpecifics.concat(name))
        setBacteriaImages(bacteriaSpecificImages.filter(img => img.name !== name))
        setAddedBacteriaImage(addedBacteriaImage.filter(bac => bac !== name))
    }

    const handleSpecificImg = (event) => {
        if (event.target.files[0]) {
            var file = event.target.files[0]
            var blob = file.slice(0, file.size, file.type)
            var newFile = new File([blob], bacterium, { type: file.type })
            setBacteriaImage(newFile)
        }
    }

    return (
        <div>
            <Button style={style}
                id={testToEdit ? 'testEditButton' : 'testModalButton'}
                variant='primary'
                onClick={() => handleShow()}>
                {testToEdit ? 'Muokkaa' : 'Luo uusi testi'}
            </Button>
            <Modal show={show} size='xl' scrollable='true' onHide={handleClose} backdrop='static'>
                <Modal.Header
                    closeButton>{testToEdit ? 'Muokkaa' : 'Luo uusi testi'}
                </Modal.Header>
                <Modal.Body>
                    {testToEdit ?
                        <DeleteButton id='deleteTest'
                            onClick={() => {
                                if (window.confirm('Tahdotko varmasti poistaa testin?')) {
                                    removeTest()
                                }
                            }}
                            text='POISTA testi'
                        ></DeleteButton>
                        : null
                    }
                    <Formik
                        validationSchema={TestSchema}
                        onSubmit={onSuccess}
                        initialValues={{
                            testName: testName,
                            testType: testType,
                            bacteriumName: bacterium
                        }}
                    >
                        {({
                            handleSubmit,
                            errors,
                            setFieldValue,
                            touched
                        }) => {
                            return (
                                <Form
                                    noValidate
                                    onSubmit={handleSubmit}
                                    encType='multipart/form-data'>
                                    <Name nameControlId='name'
                                        testName={testName}
                                        onChange={setFieldValue}
                                        error={errors.testName}
                                        touched={touched.testName}
                                        setTestName={setTestName}></Name>

                                    <Type typeControlId='type'
                                        testType={testType}
                                        onChange={setFieldValue}
                                        error={errors.testType}
                                        touched={touched.testType}
                                        setTestType={setTestType}></Type>

                                    <AddImage
                                        title='Kontrollikuva'
                                        name='controlImage'
                                        value={controlImage.image}
                                        setImage={setControlImage}
                                        setAdded={setCtrl}
                                        imgPreview={imgPreviewCtrl}
                                        setImgPreview={setImgPreviewCtrl}
                                    ></AddImage>
                                    {testToEdit ?
                                        <Form.Group controlId='editControlImage'>

                                            {ctrl && testToEdit.controlImage ?
                                                <Image src={`/${testToEdit.controlImage.url}`} thumbnail width={100} />
                                                : <></>
                                            }
                                            <DeleteButton
                                                id='deleteControl'
                                                onClick={() => {
                                                    setCtrl(false)
                                                    setDeletePhotos({ ...deletePhotos, ctrl: true })
                                                }}
                                                text='Poista kontrollikuva'
                                            ></DeleteButton>
                                        </Form.Group>
                                        :
                                        null
                                    }


                                    <AddImage
                                        title='Positiivinen oletus'
                                        name='posImg'
                                        value={positiveResultImage.image}
                                        setImage={setPositiveResultImage}
                                        setAdded={setPos}
                                        imgPreview={imgPreviewPos}
                                        setImgPreview={setImgPreviewPos}
                                    ></AddImage>

                                    {testToEdit ?
                                        <Form.Group controlId='editPositiveResultImage'>
                                            {pos && testToEdit.positiveResultImage ?
                                                <Image src={`/${testToEdit.positiveResultImage.url}`} thumbnail width={100} />
                                                : <></>
                                            }
                                            <DeleteButton
                                                id='deletePositive'
                                                onClick={() => {
                                                    setPos(false)
                                                    setDeletePhotos({ ...deletePhotos, pos: true })
                                                }}
                                                text='Poista positiivinen kuva'
                                            ></DeleteButton>
                                        </Form.Group>
                                        :
                                        null
                                    }

                                    <AddImage
                                        title='Negatiivinen oletus'
                                        name='negImg'
                                        value={negativeImage.image}
                                        setImage={setNegativeImage}
                                        setAdded={setNeg}
                                        imgPreview={imgPreviewNeg}
                                        setImgPreview={setImgPreviewNeg}
                                    ></AddImage>
                                    {testToEdit ?
                                        <Form.Group controlId='editNegativeResultImage'>
                                            {neg && testToEdit.negativeResultImage ?
                                                <Image src={`/${testToEdit.negativeResultImage.url}`} thumbnail width={100} />
                                                : <></>
                                            }
                                            <DeleteButton
                                                id='deleteNegative'
                                                onClick={() => { setNeg(false); setDeletePhotos({ ...deletePhotos, neg: true }) }}
                                                text='Poista negatiivinen kuva'
                                            ></DeleteButton>
                                        </Form.Group>
                                        :
                                        null
                                    }

                                    <BacteriaSpecificImages
                                        controlId={testToEdit ? 'editBacteriaSpecificImages' : 'bacteriaSpecificImages'}
                                        setBacterium={setBacterium}
                                        bacteria={bacteria}
                                        bacterium={bacterium}
                                        handleSpecificImg={handleSpecificImg}
                                        bacteriaSpecificImages={bacteriaSpecificImages}
                                        bacteriaSpecificImage={bacteriaSpecificImage}
                                        addBacteriumSpecificImage={addBacteriumSpecificImage}
                                        removeBacteriaSpecificImage={removeBacteriaSpecificImage}
                                        marginStyle={marginStyle}
                                        addedBacteriaImage={addedBacteriaImage}
                                        onChange={setFieldValue}
                                        error={errors.bacteriumName}
                                        touched={touched.bacteriumName}
                                    />
                                    <Button id={testToEdit ? 'saveChanges' : 'addTest'} variant='success' type='submit'>{testToEdit ? 'Tallenna muutokset' : 'Tallenna'}</Button>

                                    { Object.keys(errors).length > 0 ?
                                        <p style={{ color: 'red' }}>Testiä ei voida lisätä, tarkista lisäämäsi syötteet.</p>
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

export default TestForm



