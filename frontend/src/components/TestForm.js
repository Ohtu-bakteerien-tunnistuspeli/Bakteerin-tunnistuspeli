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
    const bacterium = useField('test')
    const [controlImage, setControlImage] = useState(INITIAL_STATE)
    const [positiveResultImage, setPhotoPos] = useState(INITIAL_STATE)
    const [negativeResultImage, setPhotoNeg] = useState(INITIAL_STATE)
    const [bacteriaSpecificImages, setBacteriaImages] = useState(INITIAL_STATE)
   //  const tests = [{ id: '1a3g', name: 'testi3', type: 'Viljely' }, { id: '1a2b', name: 'testi1', type: 'Testi' }, { id: '3c4d', name: 'testi2', type: 'Värjäys' }]
    const user = useSelector(state => state.user)
    const dispatch = useDispatch()

    const addTests = (event) => {

        event.preventDefault()
        dispatch(addTest(TestName, TestType, controlImage, positiveResultImage, negativeResultImage, bacteriaSpecificImages, user.token))
        setPhotoPos([])
        setPhotoNeg([])
        setBacteriaImages([])
    }

    const [show, setShow] = useState(false)
    const handleShow = () => setShow(true)
    const handleClose = () => setShow(false)

    const handleChange = (event) => {
        const { name, value } = event.target
        setPhotoPos({ ...positiveResultImage, [name]: value })
    }

    const handleChange2 = (event) => {
        const { name, value } = event.target
        setPhotoNeg({ ...negativeResultImage, [name]: value })
    }

    const handleChange3 = (event) => {
        const { name, value } = event.target
        setControlImage({ ...controlImage, [name]: value })
    }

    return (
        <div>
            <Button variant="primary" onClick={handleShow}>
              Luo uusi testi
            </Button>
            <Modal show={show} size='lg' onHide={handleClose} >
                <Modal.Header closeButton></Modal.Header>
                <Modal.Body>
                    <form onSubmit={addTests}>
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
                            <Form.Control encType="multipart/form-data"
                                name='controlImage'
                                type="file"
                                value={controlImage.image}
                                onChange={handleChange3}
                            />
                        </Form.Group>
                        <Form.Group controlId="positiveResultImage">
                            <Form.Label>Positiivinen oletus</Form.Label>
                            <Form.Control encType="multipart/form-data"
                                name='positiveResultImage'
                                type="file"
                                value={positiveResultImage.image}
                                onChange={handleChange}
                            />
                        </Form.Group>
                        <Form.Group controlId="negativeResultImage">
                            <Form.Label>Negatiivinen Oletus</Form.Label>
                            <Form.Control encType="multipart/form-data"
                                name="negativeResultImage"
                                type="file"
                                value={negativeResultImage.image}
                                onChange={handleChange2}
                            />
                        </Form.Group>
                        <Form.Group controlId="bacteriaSpecificImages">
                        <Form.Label>BakteeriKohtaiset Tulokset</Form.Label>
                        <div></div>
                        <Form.Label>Bakteeri</Form.Label>
                            <Form.Control as="select" type={bacterium.type} value={bacterium.value} onChange={bacterium.onChange}>
                                {bacteria.map(bacterium =>
                                    <option key={bacterium.id} value={bacterium.id}>{bacterium.name}</option>
                                )}
                            </Form.Control>
                            <Form.Label>BakteeriKohtainen Positiivinen oletus </Form.Label>
                            <Form.Control encType="multipart/form-data"
                                name='positiveResultImage'
                                type="file"
                                value={positiveResultImage.image}
                                onChange={handleChange}
                            />
                            <Form.Label>BakteerKohtainen Negatiivinen Oletus</Form.Label>
                            <Form.Control encType="multipart/form-data"
                                name="negativeResultImage"
                                type="file"
                                value={negativeResultImage.image}
                                onChange={handleChange2}
                            />
                        </Form.Group>
                        <div></div>
                        <button type="submit">Lisää</button>
                    </form>
                </Modal.Body>
            </Modal>
        </div>
    )
}

export default TestForm

