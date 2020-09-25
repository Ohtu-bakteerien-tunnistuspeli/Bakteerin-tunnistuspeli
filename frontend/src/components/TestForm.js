import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { addTest } from '../reducers/testReducer'
import { Modal, Button } from 'react-bootstrap'

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

    const name = useField('text')
    const type = useField('text')
    const [positiveResultImage, setPhotoPos] = useState(INITIAL_STATE)
    const [negativeResultImage, setPhotoNeg] = useState(INITIAL_STATE)
    const [bacteriaSpecificImages, setBacteriaImages] = useState(INITIAL_STATE)
    const user = useSelector(state => state.user)
    // const bacteria = useSelector(state => state.bacteria)?.sort((bacterium1, bacterium2) => bacterium1.name.localeCompare(bacterium2.name))
    const dispatch = useDispatch()

    const addTests = (event) => {

        event.preventDefault()
        dispatch(addTest(name, type, positiveResultImage, negativeResultImage, bacteriaSpecificImages, user.token))
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
        setPhotoNeg({ ... negativeResultImage, [name]: value })
    }

    //const handleChange3 = (event) => {
    //    const { name, value } = event.target
    //    setPhotoNeg({ ...bacteriaSpecificImages, [name]: value })
    // }

    return (
        <div>
            <Button variant="primary" onClick={handleShow}>
              Launch Form modal
            </Button>
            <Modal show={show} size="lg" onHide={handleClose} >
                <Modal.Header closeButton></Modal.Header>
                <Modal.Body style={{ alignItems: 'center', padding: '0', position: 'absolute', maxWidth: 'max-content', height: 'auto', display: 'block' }} >
                    <form onSubmit={addTests}>
                        <p>Nimi</p>
                        <input
                            id="name"
                            type={name.type}
                            value={name.value}
                            onChange={name.onChange}
                        />
                        <p>Tyyppi</p>
                        <input
                            id="type"
                            type={type.type}
                            value={type.value}
                            onChange={type.onChange}
                        />
                        <p>Positiivinen oletus</p>
                        <input encType="multipart/form-data"
                            id="positiveResultImage"
                            name='positiveResultImage'
                            type="file"
                            value={positiveResultImage.image}
                            onChange={handleChange}
                        />
                        <p>Negatiivinen oletus</p>
                        <input encType="multipart/form-data"
                            id="negativeResultImage"
                            name="negativeResultImage"
                            type="file"
                            value={negativeResultImage.image}
                            onChange={handleChange2}
                        />
                        <div></div>
                        <button type="submit">Lisää</button>
                    </form>
                </Modal.Body>
            </Modal>
        </div>
    )
}

export default TestForm
