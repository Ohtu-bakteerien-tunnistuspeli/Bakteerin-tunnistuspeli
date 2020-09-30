import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { deleteTest, updateTest } from '../reducers/testReducer'
import { Button, Form } from 'react-bootstrap'

const INITIAL_STATE = {
    id: '',
    bacterium: '',
    image: undefined,
}

const TestEditForm = ( {test, stopModify} ) => {
    // Get info of this test from parameter 'test'
    // and set that info as staring value for fields
    const [newName, setNewName] = useState(test.name)
    const [newType, setNewType] = useState(test.type)
    const [photoPos, setPhotoPos] = useState(INITIAL_STATE)
    const [photoNeg, setPhotoNeg] = useState(INITIAL_STATE)
    const [photoControl, setPhotoControl] = useState(INITIAL_STATE)
    const [bacteriaSpecificImages, setBacteriaImages] = useState(test.bacteriaSpecificImages)
    const [bacteriaSpecificImage, setBacteriaImage] = useState(INITIAL_STATE)
    const [bacterium, setBacterium] = useState('')
    const bacteria = useSelector(state => state.bacteria)?.sort((bacterium1, bacterium2) => bacterium1.name.localeCompare(bacterium2.name))
    const user = useSelector(state => state.user)
    const dispatch = useDispatch()

    if (test.positiveResultImage) {
        setPhotoPos(test.positiveResultImage)
    }
    if (test.negativeResultImage) {
        setPhotoNeg(test.negativeResultImage)
    }
    if (test.controlResultImage) {
        setPhotoControl(test.controlResultImage)
    }
    console.log('test at start', test)
        console.log('id at start', test.id)

    // Get test.id from parameter 'test'
    const removeTest = () => {
        console.log('deletion form ', test.id)
        dispatch(deleteTest(test.id, user.token))
    }
    const editTest = (event) => {
        console.log('dispatching edit ', newName)
        event.preventDefault()
        var token = user.token
        var id = test.id
        console.log(token)
        done()
        dispatch(updateTest(id, newName, newType, photoControl, photoPos, photoNeg, bacteriaSpecificImages, token))
    }

    const done = () => {
        stopModify()
    }

    const addBacteriumSpecificImage = () => {
        if(bacterium !== '') {
            setBacteriaImages(bacteriaSpecificImages.concat(bacteriaSpecificImage))
            setBacteriaImage(INITIAL_STATE)
            setBacterium('')
        }   
    }

    const handleSpecificImg = (event) => {
        if(event.target.files[0]) {
            Object.defineProperty(event.target.files[0], 'name', {
            writable: true,
            value: bacterium }) 
            setBacteriaImage(event.target.files[0])
            console.log(event.target.files[0])
        } 
    }

    return (
        <div>
            <p></p>
            <p></p>
            <Button variant='danger' id='deleteTest' onClick={ () => removeTest(test) }>POISTA testi</Button>
            <p></p>
            <Form onSubmit={ editTest } encType="multipart/form-data">
                <Form.Group controlId="name">
                    <Form.Label>Uusi nimi</Form.Label>
                    <Form.Control type='input' value={newName} onChange={ ({ target }) => setNewName(target.value) } />
                </Form.Group>
                <Form.Group controlId="type">
                    <Form.Label>Tyyppi</Form.Label>
                    <Form.Control type='input' value={newType} onChange={ ({ target }) => setNewType(target.value) } />
                </Form.Group>
                <Form.Group controlId="editControlImage">
                    <Form.Label>Kontrollikuva</Form.Label>
                    <Form.Control 
                        name='editCtrlImg'
                        value= { photoControl.image }
                        type='file'
                        onChange={ ({ target }) => setPhotoControl(target.files[0]) }
                    />
                </Form.Group>
                <Form.Group controlId="editPositiveResultImage">
                    <Form.Label>Positiivinen oletus</Form.Label>
                    <Form.Control
                        name='editTestPosImg'
                        value= { photoPos.image }
                        type='file'
                        onChange={ ({ target }) => setPhotoPos(target.files[0]) }
                    />
                </Form.Group>
                <Form.Group controlId="editNegativeResultImage">
                    <Form.Label>Negatiivinen Oletus</Form.Label>
                    <Form.Control 
                        name='editTestNegImg'
                        value= { photoNeg.image }
                        type='file'
                        onChange={ ({ target }) => setPhotoNeg(target.files[0]) }
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
                    <Form.Control as="select" value={bacterium} onClick={({target})=>setBacterium(target.value)} onChange={({target})=>setBacterium(target.value)}>
                        {bacteria.map(bact =>
                            <option key={bact.id} value={bact.name}>{bact.name}</option>
                        )}
                    </Form.Control> 
                    <Form.Label>BakteeriKohtaiset Kuvat </Form.Label>
                    <Form.Control 
                        name='positiveResultImage'
                        type="file"
                        value={bacteriaSpecificImage.image}
                        onChange={handleSpecificImg}
                    />
                    <p></p>
                    <Button type='button' onClick={addBacteriumSpecificImage}>Lisää bakteerikohtainen kuva</Button>
                </Form.Group> 
                <div></div>

                <Button type='submit'>Tallenna muutokset</Button>
                <p></p>
            </Form>
        </div>
    )
}

export default TestEditForm
