import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { deleteTest, updateTest } from '../reducers/testReducer'
import { Button, Form } from 'react-bootstrap'

const INITIAL_STATE = {
    id: '',
    bacterium: '',
    image: undefined,
}

const TestEditForm = ({ test, stopModify, bacteria }) => {
    // Get info of this test from parameter 'test'
    // and set that info as staring value for fields
    const [newName, setNewName] = useState(test.name)
    const [newType, setNewType] = useState(test.type)
    const [photoPos, setPhotoPos] = useState(INITIAL_STATE)
    const [photoNeg, setPhotoNeg] = useState(INITIAL_STATE)
    const [photoControl, setPhotoControl] = useState(INITIAL_STATE)
    const [bacteriaSpecificImages, setBacteriaImages] = useState([])
    const [bacteriaSpecificImage, setBacteriaImage] = useState(INITIAL_STATE)
    const [bacterium, setBacterium] = useState(bacteria[0]?.name)
    const user = useSelector(state => state.user)
    const dispatch = useDispatch()

    console.log(bacteria[0])
    //Is this needed?
    //const testList = [...test.bacteriaSpecificImages]

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
        done()
        console.log(bacteriaSpecificImages)
        console.log(photoControl)
        dispatch(updateTest(id, newName, newType, photoControl, photoPos, photoNeg, bacteriaSpecificImages, token))
    }

    const done = () => {
        stopModify()
    }

    const addBacteriumSpecificImage = () => {
        console.log('add', bacteriaSpecificImage)
        if (bacteriaSpecificImage.image !== 'undefined' && bacteriaSpecificImage.bacterium !== '' ) {
            if (bacteriaSpecificImage.name !== '' && !bacteriaSpecificImages.map(b => b.name).includes(bacteriaSpecificImage.name)) {
                //testList.push(bacteriaSpecificImage)
                setBacteriaImages(bacteriaSpecificImages.concat(bacteriaSpecificImage))
                console.log('after adding', bacteriaSpecificImages)
                setBacteriaImage(INITIAL_STATE)
            }
        }
    }

    const handleSpecificImg = (event) => {
        console.log('in handle', bacterium)
        if (event.target.files[0]) {
            var file = event.target.files[0]
            var blob = file.slice(0, file.size, file.type)
            var newFile = new File([blob], bacterium, { type: file.type })
            setBacteriaImage(newFile)
        }
    }

    return (
        <div>
            <p></p>
            <p></p>
            <Button variant='danger' id='deleteTest' onClick={() => removeTest(test)}>POISTA testi</Button>
            <p></p>
            <Form onSubmit={editTest} encType="multipart/form-data">
                <Form.Group>
                    <Form.Label>Uusi nimi</Form.Label>
                    <Form.Control id="newNameInput" type='input' value={newName} onChange={({ target }) => setNewName(target.value)} />
                </Form.Group>
                <Form.Group>
                    <Form.Label>Tyyppi</Form.Label>
                    <Form.Control id="newTypeInput" type='input' value={newType} onChange={({ target }) => setNewType(target.value)} />
                </Form.Group>
                <Form.Group controlId="editControlImage">
                    <Form.Label>Kontrollikuva</Form.Label>
                    <Form.Control
                        name='editCtrlImg'
                        value={photoControl.image}
                        type='file'
                        onChange={({ target }) => setPhotoControl(target.files[0])}
                    />
                </Form.Group>
                <Form.Group controlId="editPositiveResultImage">
                    <Form.Label>Positiivinen oletus</Form.Label>
                    <Form.Control
                        name='editTestPosImg'
                        value={photoPos.image}
                        type='file'
                        onChange={({ target }) => setPhotoPos(target.files[0])}
                    />
                </Form.Group>
                <Form.Group controlId="editNegativeResultImage">
                    <Form.Label>Negatiivinen oletus</Form.Label>
                    <Form.Control
                        name='editTestNegImg'
                        value={photoNeg.image}
                        type='file'
                        onChange={({ target }) => setPhotoNeg(target.files[0])}
                    />
                </Form.Group>

                <Form.Group controlId="editBacteriaSpecificImages">
                    <Form.Label>Bakteerikohtaiset tulokset</Form.Label>
                    <div></div>
                    <ul>
                        {bacteriaSpecificImages.map((image, i) =>
                            <li key={i}>{image.name}</li>
                        )}
                    </ul>
                    <Form.Label>Bakteeri</Form.Label>
                    <Form.Control as="select" 
                        value={bacterium} onClick={({ target }) => setBacterium(target.value)} 
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
                    <p></p>
                    <Button type='button' onClick={addBacteriumSpecificImage}>Lisää bakteerikohtainen kuva</Button>
                    <Button type='button' variant="warning" onClick={() => setBacteriaImages([])}>Tyhjennä bakteerikohtaisten kuvien lista</Button>
                </Form.Group>
                <div></div>

                <Button id="saveChanges" type='submit'>Tallenna muutokset</Button>
                <p></p>
            </Form>
        </div>
    )
}

export default TestEditForm
