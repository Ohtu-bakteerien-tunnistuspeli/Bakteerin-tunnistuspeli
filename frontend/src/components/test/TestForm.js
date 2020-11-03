import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { addTest } from '../../reducers/testReducer'
import { Modal, Button, Form } from 'react-bootstrap'
import BacteriaSpecificImages from './BacteriaSpecificImages'
import Name from './components/Name.js'
import Type from './components/Type.js'
import DeleteButton from './components/DeleteButton.js'
import AddImage from './components/AddImage.js'
import { INITIAL_STATE, marginStyle } from './utility'
import { deleteTest, updateTest } from '../../reducers/testReducer'



const TestForm = ({ testToEdit }) => {

    /* style parameters */
    const style = { margin: '10px', float: 'right' }
    const borderStyle = { borderStyle: 'solid', borderColor: 'black', borderWidth: 'thin' }
    /* style parameters end */

    /* initial parameters */
    const bacteria = useSelector(state => state.bacteria)?.sort((bacterium1, bacterium2) => bacterium1.name.localeCompare(bacterium2.name))
    const user = useSelector(state => state.user)
    const dispatch = useDispatch()
    /* initial parameters end */

    /* states */
    const [testName, setTestName] = useState(testToEdit ? testToEdit.name : '')
    const [testType, setTestType] = useState(testToEdit ? testToEdit.type : '')
    const [bacterium, setBacterium] = useState(testToEdit ? testToEdit.bacterium : '')
    const [controlImage, setControlImage] = useState(INITIAL_STATE)
    const [positiveResultImage, setPositiveResultImage] = useState(INITIAL_STATE)
    const [negativeImage, setNegativeImage] = useState(INITIAL_STATE)
    const [bacteriaSpecificImages, setBacteriaImages] = useState(testToEdit && testToEdit.bacteriaSpecificImages.length > 0 ? testToEdit.bacteriaSpecificImages : [])
    const [bacteriaSpecificImage, setBacteriaImage] = useState(INITIAL_STATE)
    const [deletePhotos, setDeletePhotos] = useState({ ctrl: false, pos: false, neg: false })
    const [deleteSpecifics, setDeleteSpecifics] = useState([])
    const [pos, setPos] = useState(testToEdit ? testToEdit.positiveResultImage ? true : false : false)
    const [neg, setNeg] = useState(testToEdit ? testToEdit.negativeImage ? true : false : false)
    const [ctrl, setCtrl] = useState(testToEdit ? testToEdit.controlImage ? true : false : false)
    /* states end */

    /* modal control */
    const [show, setShow] = useState(false)
    const handleShow = () => setShow(true)
    const handleClose = () => setShow(false)
    /* modal control end */

    /* form control */
    const addTests = (event) => {
        event.preventDefault()
        dispatch(addTest(testName,
            testType,
            controlImage,
            positiveResultImage,
            negativeImage,
            bacteriaSpecificImages,
            user.token,
            resetTestForm))
        handleClose()
    }

    const resetTestForm = () => {
        setControlImage([])
        setPositiveResultImage([])
        setNegativeImage([])
        setBacteriaImages(testToEdit && testToEdit.bacteriaSpecificImages.length > 0 ? testToEdit.bacteriaSpecificImages : [])
        setTestName('')
        setTestType('')
        setDeleteSpecifics([])
    }

    const removeTest = () => {
        dispatch(deleteTest(testToEdit.id, user.token))
    }

    const editTest = (event) => {
        event.preventDefault()
        const photosToDelete = deletePhotos
        const token = user.token
        const id = testToEdit.id
        setDeleteSpecifics([])
        dispatch(updateTest(id, testName,
            testType, controlImage,
            positiveResultImage, negativeImage,
            bacteriaSpecificImages,
            photosToDelete,
            deleteSpecifics,
            token))
    }
    /* form control end */

    const addBacteriumSpecificImage = () => {
        if (bacteriaSpecificImage.image !== 'undefined' && bacteriaSpecificImage.bacterium !== '') {
            if (bacteriaSpecificImage.name !== '') {
                setBacteriaImages(bacteriaSpecificImages.concat(bacteriaSpecificImage))
                setDeleteSpecifics(deleteSpecifics.filter(img => img !== bacteriaSpecificImage.name))
                setBacteriaImage(INITIAL_STATE)
            }
        }
    }

    const removeBacteriaSpecificImage = (image) => {
        let name
        image.name ? name = image.name : name = image.bacterium.name
        setDeleteSpecifics(deleteSpecifics.concat(name))
        setBacteriaImages(bacteriaSpecificImages.filter(img => img.name !== name))
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
                onClick={handleShow}>
                {testToEdit ? 'Muokkaa' : 'Luo uusi testi'}
            </Button>
            <Modal show={show} size='xl' scrollable='true' onHide={handleClose} >
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
                    <Form
                        onSubmit={testToEdit ? editTest : addTests}
                        encType='multipart/form-data'>
                        <Name nameControlId='name'
                            testName={testName}
                            setTestName={setTestName}></Name>
                        <Type typeControlId='type'
                            testType={testType}
                            setTestType={setTestType}></Type>
                        <AddImage
                            title='Kontrollikuva'
                            name='controlImage'
                            value={controlImage.image}
                            setImage={setControlImage}
                            setAdded={setCtrl}
                        ></AddImage>
                        {testToEdit ?
                            <Form.Group controlId='editControlImage'>

                                {ctrl ?
                                    <p style={borderStyle}>Kontrollikuva on annettu</p>
                                    : <></>
                                }
                                <DeleteButton
                                    id='deleteControl'
                                    onClick={() => { setCtrl(false); setDeletePhotos({ ...deletePhotos, ctrl: true }) }}
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
                        ></AddImage>

                        {testToEdit ?
                            <Form.Group controlId='editPositiveResultImage'>
                                {pos ?
                                    <p style={borderStyle}>Positiivinen on annettu</p>
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
                        ></AddImage>
                        {testToEdit ?
                            <Form.Group controlId='editNegativeResultImage'>
                                {neg ?
                                    <p style={borderStyle}>Negatiivinen kuva on annettu</p>
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
                            setBacteriaImages={setBacteriaImages}
                            handleSpecificImg={handleSpecificImg}
                            bacteriaSpecificImages={bacteriaSpecificImages}
                            bacteriaSpecificImage={bacteriaSpecificImage}
                            addBacteriumSpecificImage={addBacteriumSpecificImage}
                            removeBacteriaSpecificImage={removeBacteriaSpecificImage}
                            marginStyle={marginStyle}
                        />
                        <Button id={testToEdit ? 'saveChanges' : 'addTest'} variant='success' type='submit'>{testToEdit ? 'Tallenna muutokset' : 'Tallenna'}</Button>
                    </Form>
                </Modal.Body>
            </Modal>
        </div>
    )
}

export default TestForm



