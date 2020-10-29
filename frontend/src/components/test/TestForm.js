import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { addTest } from '../../reducers/testReducer'
import { Modal, Button, Form } from 'react-bootstrap'
import BacteriaSpecificImages from './BacteriaSpecificImages'
import NameAndType from './NameAndType'
import { useField, INITIAL_STATE, marginStyle } from './utility'

const TestForm = () => {
    const style = { margin: '10px' }
    const bacteria = useSelector(state => state.bacteria)?.sort((bacterium1, bacterium2) => bacterium1.name.localeCompare(bacterium2.name))
    const TestName = useField('text', '')
    const TestType = useField('text', '')
    const [bacterium, setBacterium] = useState('')
    const [controlImage, setControlImage] = useState(INITIAL_STATE)
    const [positiveResultImage, setPhotoPos] = useState(INITIAL_STATE)
    const [negativeResultImage, setPhotoNeg] = useState(INITIAL_STATE)
    const [bacteriaSpecificImages, setBacteriaImages] = useState([])
    const [bacteriaSpecificImage, setBacteriaImage] = useState(INITIAL_STATE)

    const user = useSelector(state => state.user)
    const dispatch = useDispatch()

    const addTests = (event) => {
        event.preventDefault()
        dispatch(addTest(TestName, TestType, controlImage, positiveResultImage, negativeResultImage, bacteriaSpecificImages, user.token, resetTestForm))
        handleClose()
    }

    const resetTestForm = () => {
        setPhotoPos([])
        setPhotoNeg([])
        setBacteriaImages([])
        TestName.reset()
        TestType.reset()
    }

    const [show, setShow] = useState(false)
    const handleShow = () => setShow(true)
    const handleClose = () => setShow(false)

    const handleChange = (event) => {
        setPhotoPos(event.target.files[0])
    }

    const handleChange2 = (event) => {
        setPhotoNeg(event.target.files[0])
    }

    const handleChange3 = (event) => {
        setControlImage(event.target.files[0])
    }

    const addBacteriumSpecificImage = () => {
        if (bacteriaSpecificImage.image !== 'undefined' && bacteriaSpecificImage.bacterium !== '') {
            if (bacteriaSpecificImage.name !== '') {
                setBacteriaImages(bacteriaSpecificImages.concat(bacteriaSpecificImage))
                setBacteriaImage(INITIAL_STATE)
            }
        }
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
            <Button style={style} id='testModalButton' variant='primary' onClick={handleShow}>Luo uusi testi</Button>
            <Modal show={show} size='lg' onHide={handleClose} >
                <Modal.Header closeButton>Luo uusi testi</Modal.Header>
                <Modal.Body>
                    <Form onSubmit={addTests} encType='multipart/form-data'>
                        <NameAndType
                            nameControlId='name'
                            typeControlId='type'
                            TestName={TestName}
                            TestType={TestType}
                        />
                        <Form.Group controlId='controlImage'>
                            <Form.Label>Kontrollikuva</Form.Label>
                            <Form.Control
                                name='controlImage'
                                type='file'
                                value={controlImage.image}
                                onChange={handleChange3}
                                onClick={(event) => event.target.value = ''}
                            />
                        </Form.Group>
                        <Form.Group controlId='positiveResultImage'>
                            <Form.Label>Positiivinen oletus</Form.Label>
                            <Form.Control
                                name='positiveResultImage'
                                type='file'
                                value={positiveResultImage.image}
                                onChange={handleChange}
                            />
                        </Form.Group>
                        <Form.Group controlId='negativeResultImage'>
                            <Form.Label>Negatiivinen Oletus</Form.Label>
                            <Form.Control
                                name='negativeResultImage'
                                type='file'
                                value={negativeResultImage.image}
                                onChange={handleChange2}
                            />
                        </Form.Group>
                        <BacteriaSpecificImages
                            controlId='bacteriaSpecificImages'
                            setBacterium={setBacterium}
                            bacteria={bacteria}
                            bacterium={bacterium}
                            setBacteriaImages={setBacteriaImages}
                            handleSpecificImg={handleSpecificImg}
                            bacteriaSpecificImages={bacteriaSpecificImages}
                            bacteriaSpecificImage={bacteriaSpecificImage}
                            addBacteriumSpecificImage={addBacteriumSpecificImage}
                            marginStyle={marginStyle}
                        />
                        <Button id='addTest' type='submit'>Lisää</Button>
                    </Form>
                </Modal.Body>
            </Modal>
        </div>
    )
}

export default TestForm



