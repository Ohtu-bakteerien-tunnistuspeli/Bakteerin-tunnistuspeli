import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { addTest } from '../reducers/testReducer'
import { Modal, Button, Form } from 'react-bootstrap'

const useField = (type) => {
    const [value, setValue] = useState('')
    const onChange = (event) => {
        setValue(event.target.value)
    }
    const reset = (event)=> {
        setValue('')
    }
    return {
        type,
        value,
        onChange,
        reset
    }
}

const TestForm = () => {

    const INITIAL_STATE = {
        id: '',
        bacterium: '',
        image: undefined,
    }

    const bacteria = useSelector(state => state.bacteria)?.sort((bacterium1, bacterium2) => bacterium1.name.localeCompare(bacterium2.name))
    //  const tests = useSelector(state => state.test)?.sort((test1, test2) => test1.name.localeCompare(test2.name))
    const TestName = useField('text')
    const TestType = useField('text')
    const [bacterium, setBacterium] = useState(bacteria[0].name)
    const [controlImage, setControlImage] = useState(INITIAL_STATE)
    const [positiveResultImage, setPhotoPos] = useState(INITIAL_STATE)
    const [negativeResultImage, setPhotoNeg] = useState(INITIAL_STATE)
    const [bacteriaSpecificImages, setBacteriaImages] = useState([])
    const [bacteriaSpecificImage, setBacteriaImage] = useState(INITIAL_STATE)
    //  const tests = [{ id: '1a3g', name: 'testi3', type: 'Viljely' }, { id: '1a2b', name: 'testi1', type: 'Testi' }, { id: '3c4d', name: 'testi2', type: 'Värjäys' }]

    const user = useSelector(state => state.user)
    const dispatch = useDispatch()

    const addTests = (event) => {

        event.preventDefault()
        console.log('dispatch')
        dispatch(addTest(TestName, TestType, controlImage, positiveResultImage, negativeResultImage, bacteriaSpecificImages, user.token))
        setPhotoPos([])
        setPhotoNeg([])
        setBacteriaImages([])
        TestName.reset()
        TestType.reset()
        handleClose()
    }

    const [show, setShow] = useState(false)
    const handleShow = () => setShow(true)
    const handleClose = () => setShow(false)

    const handleChange = (event) => {
        console.log(event.target)
        setPhotoPos(event.target.files[0])
    }

    const handleChange2 = (event) => {
        console.log(event.target)
        setPhotoNeg(event.target.files[0])
    }

    const handleChange3 = (event) => {
        console.log(event.target)
        setControlImage(event.target.files[0])
    }

    const addBacteriumSpecificImage = () => {
        console.log(bacteriaSpecificImage.bacterium)
        console.log(bacteriaSpecificImage.image)
        if (bacteriaSpecificImage.image !== 'undefined' && bacteriaSpecificImage.bacterium !== '' ) {
            if (bacteriaSpecificImage.name !== '') {
                setBacteriaImages(bacteriaSpecificImages.concat(bacteriaSpecificImage))
                console.log('after adding', bacteriaSpecificImages)
                setBacteriaImage(INITIAL_STATE)
            }
        }
    }

    const handleSpecificImg = (event) => {
        console.log('in handle', bacterium)
        if (event.target.files[0]){
            var file = event.target.files[0]
            var blob = file.slice(0, file.size, file.type)
            var newFile = new File([blob], bacterium, { type: file.type })
            setBacteriaImage(newFile)
        }
    }

    return (
        <div>
            <Button id="testModalButton" variant="primary" onClick={handleShow}>
                Luo uusi testi
            </Button>
            <Modal show={show} size='lg' onHide={handleClose} >
                <Modal.Header closeButton></Modal.Header>
                <Modal.Body>
                    <Form onSubmit={addTests} encType="multipart/form-data">
                        <Form.Group controlId="name">
                            <Form.Label>Nimi</Form.Label>
                            <Form.Control type={TestName.type} value={TestName.value} onChange={TestName.onChange} reset='' />
                        </Form.Group>
                        <Form.Group controlId="type">
                            <Form.Label>Tyyppi</Form.Label>
                            <Form.Control type={TestType.type} value={TestType.value} onChange={TestType.onChange} reset='' />
                                {/* This can be added if accepted of all
                                <Form.Control as="select" type={TestType.type} value={TestType.value} onClick={TestType.onChange} onChange={TestType.onChange}>
                                    <option key="1">Valitse testin tyyppi</option>
                                    <option key="2" value="Värjäys">Värjäys</option> 
                                    <option key="3" value="Testi">Testi</option>
                                    <option key="4" value="Viljely">Viljely</option>
                                </Form.Control>*/}
                        </Form.Group>
                        <Form.Group controlId="controlImage">
                            <Form.Label>Kontrollikuva</Form.Label>
                            <Form.Control
                                name='controlImage'
                                type="file"
                                value={controlImage.image}
                                onChange={handleChange3}
                                onClick={(event) => event.target.value = ''}
                            />
                        </Form.Group>
                        <Form.Group controlId="positiveResultImage">
                            <Form.Label>Positiivinen oletus</Form.Label>
                            <Form.Control
                                name='positiveResultImage'
                                type="file"
                                value={positiveResultImage.image}
                                onChange={handleChange}
                            />
                        </Form.Group>
                        <Form.Group controlId="negativeResultImage">
                            <Form.Label>Negatiivinen Oletus</Form.Label>
                            <Form.Control
                                name="negativeResultImage"
                                type="file"
                                value={negativeResultImage.image}
                                onChange={handleChange2}
                            />
                        </Form.Group>
                        <Form.Group controlId="bacteriaSpecificImages">
                            <Form.Label>Bakteerikohtaiset Tulokset</Form.Label>
                            <div></div>
                            <ul>
                                {bacteriaSpecificImages.map((image, i) =>
                                    <li key={i}>{image.name}</li>
                                )}
                            </ul>
                            <Form.Label>Bakteeri</Form.Label>
                            <Form.Control as="select" value={bacterium}
                                onClick={({ target }) => setBacterium(target.value)}
                                onChange={({ target }) => setBacterium(target.value)}>
                                {bacteria.map(bact =>
                                    <option key={bact.id} value={bact.name}>{bact.name}</option>
                                )}
                            </Form.Control>
                            <Form.Label>Bakteerikohtaiset Kuvat </Form.Label>
                            <Form.Control
                                name='bacteriaSpecificImage'
                                type="file"
                                value={bacteriaSpecificImage.image}
                                onChange={handleSpecificImg}
                            />
                            <Button type='button' onClick={addBacteriumSpecificImage}>Lisää bakteerikohtainen kuva</Button>
                        </Form.Group>
                        <div></div>
                        <button id="addTest" type="submit">Lisää</button>
                    </Form>
                </Modal.Body>
            </Modal>
        </div>
    )
}

export default TestForm



