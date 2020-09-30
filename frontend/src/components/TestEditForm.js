import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { deleteTest, updateTest } from '../reducers/testReducer'
import { Button, Form } from 'react-bootstrap'

const INITIAL_STATE = {
    id: '',
    bacterium: '',
    image: undefined,
}

const TestEditForm = (test) => {
    test = test.test
    // Get info of this test from parameter 'test'
    // and set that info as staring value for fields
    const [newName, setNewName] = useState(test.name)
    const [newType, setNewType] = useState(test.type)
    const [photoPos, setPhotoPos] = useState(INITIAL_STATE)
    const [photoNeg, setPhotoNeg] = useState(INITIAL_STATE)
    const [photoControl, setPhotoControl] = useState(INITIAL_STATE)
    const [bacteriaSpecificImages, setBacteriaImages] = useState([])
    const [bacteriaSpecificImage, setBacteriaImage] = useState(INITIAL_STATE)
    const [bacterium, setBacterium] = useState('')
    const bacteria = useSelector(state => state.bacteria)?.sort((bacterium1, bacterium2) => bacterium1.name.localeCompare(bacterium2.name))
    const user = useSelector(state => state.user)
    const dispatch = useDispatch()

    useEffect(() => {
        console.log('name to be set')
        setNewName(test.name)
    }, [test])
    
    useEffect(() => {
        setNewType(test.type)
    }, [test])

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
    const removeTest = (t) => {
        console.log('deletion form ', t.id)
        dispatch(deleteTest(t.id, user.token))
    }
    const editTest = () => {
        dispatch(updateTest(test.id, newName, newType, photoPos, photoNeg, user.token))
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
            <Button variant='danger' id='deleteTest' onClick={ () => removeTest(test) }>POISTA testi</Button>
            <p></p>
            <Form onSubmit={ editTest } encType="multipart/form-data">
                <p>Uusi nimi</p>
                <input
                    id='editTestName'
                    value={ newName }
                    onChange={ ({ target }) => setNewName(target.value.name) }
                />
                <p>Uusi tyyppi</p>
                <input
                    id='editTestType'
                    value={ newType }
                    onChange={ ({ target }) => setNewType(target.value.type) }
                />
                <p>Kontrollikuva</p>
                <input
                    id='editCtrlImg'
                    name='editCtrlImg'
                    value= { photoControl.image }
                    type='file'
                    onChange={ ({ target }) => setPhotoControl(target.files[0]) }
                />
                <p>Positiivinen oletuskuva</p>
                <input
                    id='editTestPosImg'
                    name='editTestPosImg'
                    value= { photoPos.image }
                    type='file'
                    onChange={ ({ target }) => setPhotoPos(target.files[0]) }
                />
                <p>Negatiivinen oletuskuva</p>
                <input
                    id='editTestNegImg'
                    name='editTestNegImg'
                    value= { photoNeg.image }
                    type='file'
                    onChange={ ({ target }) => setPhotoNeg(target.files[0]) }
                />

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
                    <Button type='button' onClick={addBacteriumSpecificImage}>Lisää bakteerikohtainen kuva</Button>
                </Form.Group> 
                <div></div>

                <Button type='submit'>Tallenna muutokset</Button>
            </Form>
        </div>
    )
}

export default TestEditForm
