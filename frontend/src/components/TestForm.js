import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { addTest } from '../reducers/testReducer'
import { Modal, Button, Form } from 'react-bootstrap'

const useField = (type) => {
    const [value, setValue] = useState('')
    const onChange = (event) => {
        setValue(event.target.value)
    }
    return {
        type,
        value,
        onChange
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
    const [bacterium, setBacterium] = useState('')
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
        if (bacterium !== '') {
            bacteriaSpecificImages.push(bacteriaSpecificImage)
            setBacteriaImages(bacteriaSpecificImages)
            console.log('after adding', bacteriaSpecificImages)
            setBacteriaImage(INITIAL_STATE)
            setBacterium('')
        }
    }

    const handleSpecificImg = (event) => {
        console.log('in handle', bacterium)
        if (event.target.files[0]) {
            // Object.defineProperty(event.target.files[0], 'name', {
            // writable: true }) 
            // event.target.files[0].name = bacterium
            // setBacteriaImage(event.target.files[0])
            // console.log(event.target.files[0])
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
                            <Form.Control type={TestName.type} value={TestName.value} onChange={TestName.onChange} />
                        </Form.Group>
                        <Form.Group controlId="type">
                            <Form.Label>Tyyppi</Form.Label>
                            <Form.Control type={TestType.type} value={TestType.value} onChange={TestType.onChange} />
                            {/*      <Form.Control as="select" type={TestType.type} value={TestType.value} onChange={TestType.onChange}>
                                {tests.map(test =>
                                    <option key={test.id} value={test.id}>{test.type}</option>
                                )}
                                </Form.Control> */}
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
                            <Form.Label>BakteeriKohtaiset Tulokset</Form.Label>
                            <div></div>
                            <ul>
                                {bacteriaSpecificImages.map((image, i) =>
                                    <li key={i}>{image.name}</li>
                                )}
                            </ul>
                            <Form.Label>Bakteeri</Form.Label>
                            <Form.Control as="select" value={bacterium} onClick={({ target }) => setBacterium(target.value)} onChange={({ target }) => setBacterium(target.value)}>
                                {bacteria.map(bact =>
                                    <option key={bact.id} value={bact.name}>{bact.name}</option>
                                )}
                            </Form.Control>
                            {/*   <Form.Group controlId="bakteeri">
                            <Form.Label>Bakteeri</Form.Label>
                            <Form.Control type={bacterium.type} value={bacterium.value} onChange={({target})=>setBacterium(target.value)} />
                            </Form.Group> */}
                            <Form.Label>BakteeriKohtaiset Kuvat </Form.Label>
                            <Form.Control
                                name='positiveResultImage'
                                type="file"
                                value={bacteriaSpecificImage.image}
                                onChange={handleSpecificImg}
                            />
                            <Button type='button' onClick={addBacteriumSpecificImage}>Lisää bakteerikohatinen kuva</Button>
                            {/*       <Form.Label>BakteeriKohtainen Negatiivinen Oletus</Form.Label>
                            <Form.Control 
                                name="negativeResultImage"
                                type="file"
                                value={negativeResultImage.image}
                                onChange={handleChange4}
                     /> */}
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



