import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { deleteTest, updateTest } from '../../reducers/testReducer'
import { Modal, Button, Form } from 'react-bootstrap'
import BacteriaSpecificImages from './BacteriaSpecificImages'
import NameAndType from './NameAndType'
import { useField, INITIAL_STATE, marginStyle } from './utility'

const borderStyle = { borderStyle: 'solid', borderColor: 'black', borderWidth: 'thin' }
const TestEditForm = ({ test, show, handleHide, stopModify, bacteria }) => {
    // Get info of this test from parameter 'test'
    // and set that info as staring value for fields
    const TestName = useField('text', test.name)
    const TestType = useField('text', test.type)
    const [photoPos, setPhotoPos] = useState(INITIAL_STATE)
    const [photoNeg, setPhotoNeg] = useState(INITIAL_STATE)
    const [photoControl, setPhotoControl] = useState(INITIAL_STATE)
    const [pos, setPos] = useState(test.positiveResultImage ? true : false)
    const [neg, setNeg] = useState(test.negativeResultImage ? true : false)
    const [ctrl, setCtrl] = useState(test.controlImage ? true : false)
    const [bacteriaSpecificImages, setBacteriaImages] = useState([])
    const [bacteriaSpecificImage, setBacteriaImage] = useState(INITIAL_STATE)
    const [bacterium, setBacterium] = useState(bacteria[0]?.name)
    const [deletePhotos, setDeletePhotos] = useState({ ctrl: false, pos: false, neg: false })
    const user = useSelector(state => state.user)
    const dispatch = useDispatch()

    //Is this needed?
    //const testList = [...test.bacteriaSpecificImages]

    // Get test.id from parameter 'test'
    const removeTest = () => {
        dispatch(deleteTest(test.id, user.token))
    }
    const editTest = (event) => {
        event.preventDefault()
        const photosToDelete = deletePhotos
        const token = user.token
        const id = test.id
        stopModify()
        dispatch(updateTest(id, TestName.value, TestType.value, photoControl, photoPos, photoNeg, bacteriaSpecificImages, photosToDelete, token))
    }

    const addBacteriumSpecificImage = () => {
        if (bacteriaSpecificImage.image !== 'undefined' && bacteriaSpecificImage.bacterium !== '') {
            if (bacteriaSpecificImage.name !== '' && !bacteriaSpecificImages.map(b => b.name).includes(bacteriaSpecificImage.name)) {
                //testList.push(bacteriaSpecificImage)
                setBacteriaImages(bacteriaSpecificImages.concat(bacteriaSpecificImage))
                setBacteriaImage(INITIAL_STATE)
            }
        }
    }

    const handleSpecificImg = (event) => {
        if (event.target.files[0]) {
            const file = event.target.files[0]
            const blob = file.slice(0, file.size, file.type)
            const newFile = new File([blob], bacterium, { type: file.type })
            setBacteriaImage(newFile)
        }
    }

    return (
        <div>
            <Button variant='secondary' id='stopEdit' onClick={stopModify}>Muokattavana</Button>
            <Modal show={show} size='xl' scrollable='true' onHide={handleHide}>
                <Modal.Header closeButton>Muokkaat testiä {test.name}</Modal.Header>
                <Modal.Body>
                    <Button variant='danger' id='deleteTest' onClick={() => {if(window.confirm('Tahdotko varmasti poistaa testin?')) {removeTest(test)}}}>POISTA testi
                        <svg width='1em' height='1em' viewBox='0 0 16 16' className='bi bi-trash' fill='currentColor' xmlns='http://www.w3.org/2000/svg'>
                            <path d='M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z' />
                            <path fillRule='evenodd' d='M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4L4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z' />
                        </svg>
                    </Button>
                    <Form onSubmit={editTest} encType='multipart/form-data'>
                        <NameAndType
                            nameControlId='newNameInput'
                            typeControlId='newTypeInput'
                            TestName={TestName}
                            TestType={TestType}
                        />
                        <Form.Group controlId='editControlImage'>
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
                                onChange={({ target }) => { setPhotoControl(target.files[0]); setCtrl(true) }}
                            />
                            <Button style={marginStyle} id='deleteControl' onClick={() => { setCtrl(false); setDeletePhotos({ ...deletePhotos, ctrl: true }) }}>Poista kontrollikuva
                                <svg width='1em' height='1em' viewBox='0 0 16 16' className='bi bi-trash' fill='currentColor' xmlns='http://www.w3.org/2000/svg'>
                                    <path d='M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z' />
                                    <path fillRule='evenodd' d='M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4L4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z' />
                                </svg>
                            </Button>
                        </Form.Group>
                        <Form.Group controlId='editPositiveResultImage'>
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
                                onChange={({ target }) => { setPhotoPos(target.files[0]); setPos(true) }}
                            />
                            <Button style={marginStyle} id='deletePositive' onClick={() => { setPos(false); setDeletePhotos({ ...deletePhotos, pos: true }) }} >Poista positiivinen kuva
                                <svg width='1em' height='1em' viewBox='0 0 16 16' className='bi bi-trash' fill='currentColor' xmlns='http://www.w3.org/2000/svg'>
                                    <path d='M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z' />
                                    <path fillRule='evenodd' d='M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4L4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z' />
                                </svg>
                            </Button>
                        </Form.Group>
                        <Form.Group controlId='editNegativeResultImage'>
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
                                onChange={({ target }) => { setPhotoNeg(target.files[0]); setNeg(true) }}
                            />
                            <Button style={marginStyle} id='deleteNegative' onClick={() => { setNeg(false); setDeletePhotos({ ...deletePhotos, neg: true }) }}>Poista negatiivinen kuva
                                <svg width='1em' height='1em' viewBox='0 0 16 16' className='bi bi-trash' fill='currentColor' xmlns='http://www.w3.org/2000/svg'>
                                    <path d='M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z' />
                                    <path fillRule='evenodd' d='M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4L4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z' />
                                </svg>
                            </Button>
                        </Form.Group>
                        <BacteriaSpecificImages
                            controlId='editBacteriaSpecificImages'
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
                        <Button id='saveChanges' type='submit'>Tallenna muutokset</Button>
                    </Form>
                </Modal.Body>
            </Modal>
        </div>
    )
}

export default TestEditForm
