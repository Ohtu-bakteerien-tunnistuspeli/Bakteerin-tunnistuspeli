import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { deleteTest, updateTest } from '../reducers/testReducer'
import { Button, Form } from 'react-bootstrap'

const INITIAL_STATE = {
    id: '',
    bacterium: '',
    image: undefined,
}
const borderStyle = { borderStyle:'solid', borderColor: 'black', borderWidth: 'thin' }
const marginStyle = { margin: '10px' }

const TestEditForm = ({ test, stopModify, bacteria }) => {
    // Get info of this test from parameter 'test'
    // and set that info as staring value for fields
    const [newName, setNewName] = useState(test.name)
    const [newType, setNewType] = useState(test.type)
    const [photoPos, setPhotoPos] = useState(INITIAL_STATE)
    const [photoNeg, setPhotoNeg] = useState(INITIAL_STATE)
    const [photoControl, setPhotoControl] = useState(INITIAL_STATE)
    const [pos, setPos] = useState(test.positiveResultImage ? true : false)
    const [neg, setNeg] = useState(test.negativeResultImage ? true : false)
    const [ctrl, setCtrl] = useState(test.controlImage ? true : false)
    const [bacteriaSpecificImages, setBacteriaImages] = useState([])
    const [bacteriaSpecificImage, setBacteriaImage] = useState(INITIAL_STATE)
    const [bacterium, setBacterium] = useState(bacteria[0]?.name)
    const [deletePhotos, setDeletePhotos] = useState({ctrl: false, pos: false, neg: false})
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
        event.preventDefault()
        const photosToDelete = deletePhotos
        var token = user.token
        var id = test.id
        done()
        dispatch(updateTest(id, newName, newType, photoControl, photoPos, photoNeg, bacteriaSpecificImages, photosToDelete, token))
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
            <Button variant='danger' id='deleteTest' onClick={() => removeTest(test)}>POISTA testi
                <svg width="1em" height="1em" viewBox="0 0 16 16" className="bi bi-trash" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                    <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
                    <path fillRule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4L4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
                </svg>
            </Button>
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
                    <Form.Label style={marginStyle}>Kontrollikuva</Form.Label>
                    {ctrl ?
                    <p style={borderStyle}>Kontrollikuva on annettu</p>
                    : <></>
                    }
                    <Form.Control
                        style={marginStyle}
                        name='editCtrlImg'
                        value={photoControl.image}
                        type='file'
                        onChange={({ target }) => { setPhotoControl(target.files[0]); setCtrl(true)}}
                    />
                    <Button style={marginStyle} id='deleteControl' onClick={ () => {setCtrl(false); setDeletePhotos({...deletePhotos, ctrl: true})} }>Poista kontrollikuva
                        <svg width="1em" height="1em" viewBox="0 0 16 16" className="bi bi-trash" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                            <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
                            <path fillRule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4L4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
                        </svg>
                    </Button>
                </Form.Group>
                <Form.Group controlId="editPositiveResultImage">
                    <Form.Label style={marginStyle}>Positiivinen oletus</Form.Label>
                    {pos ?
                    <p style={borderStyle}>Positiivinen on annettu</p>
                    : <></>
                    }
                    <Form.Control
                        style={marginStyle}
                        name='editTestPosImg'
                        value={photoPos.image}
                        type='file'
                        onChange={({ target }) => { setPhotoPos(target.files[0]); setPos(true)}}
                    />
                    <Button style={marginStyle} id='deletePositive' onClick={ () => {setPos(false); setDeletePhotos({...deletePhotos, pos: true})} } >Poista positiivinen kuva
                        <svg width="1em" height="1em" viewBox="0 0 16 16" className="bi bi-trash" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                            <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
                            <path fillRule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4L4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
                        </svg>
                    </Button>
                </Form.Group>
                <Form.Group controlId="editNegativeResultImage">
                    <Form.Label style={marginStyle}>Negatiivinen oletus</Form.Label>
                    {neg ?
                    <p style={borderStyle}>Negatiivinen kuva on annettu</p>
                    : <></>
                    }
                    <Form.Control
                        style={marginStyle}
                        name='editTestNegImg'
                        value={photoNeg.image}
                        type='file'
                        onChange={({ target }) => {setPhotoNeg(target.files[0]); setNeg(true)}}
                    />
                    <Button style={marginStyle} id='deleteNegative' onClick={ () => {setNeg(false); setDeletePhotos({...deletePhotos, neg: true})} }>Poista negatiivinen kuva
                        <svg width="1em" height="1em" viewBox="0 0 16 16" className="bi bi-trash" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                            <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
                            <path fillRule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4L4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
                        </svg>
                    </Button>
                </Form.Group>

                <Form.Group controlId="editBacteriaSpecificImages">
                    <Form.Label>Bakteerikohtaiset tulokset</Form.Label>
                    <div></div>
                    <ul>
                        {bacteriaSpecificImages.map((image, i) =>
                            <li key={i}>{image.name}</li>
                        )}
                    </ul>
                    <Form.Label style={marginStyle}>Bakteeri</Form.Label>
                    <Form.Control as="select" 
                        style={marginStyle}
                        value={bacterium} onClick={({ target }) => setBacterium(target.value)} 
                        onChange={({ target }) => setBacterium(target.value)}>
                        {bacteria.map(bact =>
                            <option key={bact.id} value={bact.name}>{bact.name}</option>
                        )}
                    </Form.Control>
                    <Form.Label style={marginStyle}>Bakteerikohtaiset Kuvat </Form.Label>
                    <Form.Control
                        style={marginStyle}
                        name='bacteriaSpecificImage'
                        type="file"
                        value={bacteriaSpecificImage.image}
                        onChange={handleSpecificImg}
                    />
                    <p></p>
                    <Button style={marginStyle} type='button' onClick={addBacteriumSpecificImage}>Lisää bakteerikohtainen kuva</Button>
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
