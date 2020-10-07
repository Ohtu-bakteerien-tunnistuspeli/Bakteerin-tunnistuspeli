import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { register } from '../reducers/userReducer'
import { useHistory } from 'react-router-dom'
import { Form, Button, Modal } from 'react-bootstrap'
import { setNotification } from '../reducers/notificationReducer'
import GDBRText from './GDPRText'
const Register = () => {
    const dispatch = useDispatch()
    const history = useHistory()
    const [accept, setAccept] = useState(false)
    const [showModal, setShowModal] = useState(false)
    const handleRegister = async (event) => {
        event.preventDefault()
        const username = event.target.username.value
        const email = event.target.email.value
        const studentNumber = event.target.studentNumber.value
        const classGroup = event.target.classGroup.value
        const password = event.target.password.value
        const passwordAgain = event.target.passwordAgain.value
        if (accept) {
            if (password === passwordAgain) {
                dispatch(register(username, email, studentNumber, classGroup, password, history))
            } else {
                dispatch(setNotification({ message: 'Salasanojen tulee olla samat.', success: false }))
            }
        } else {
            dispatch(setNotification({ message: 'Käyttöehtojen hyväksyminen on pakollista.', success: false }))
        }
    }
    return (
        <div >
            <h2>Rekisteröidy Bakteeripeliin</h2>
            <Form onSubmit={handleRegister}>
                <Form.Group>
                    <Form.Label>Käyttäjänimi:</Form.Label>
                    <Form.Control
                        type="text"
                        id="username"
                        name="username"
                    />
                    <Form.Label>Sähköposti:</Form.Label>
                    <Form.Control
                        type="text"
                        id="email"
                        name="email"
                    />
                    <Form.Label>Opiskelijanumero:</Form.Label>
                    <Form.Control
                        type="text"
                        id="studentNumber"
                        name="studentNumber"
                    />
                    <Form.Label>Vuosikurssi:</Form.Label>
                    <Form.Control
                        type="text"
                        id="classGroup"
                        name="classGroup"
                        defaultValue="C-"
                    />
                    <Form.Label>Salasana:</Form.Label>
                    <Form.Control
                        type="password"
                        id="password"
                    />
                    <Form.Label>Salasana toisen kerran:</Form.Label>
                    <Form.Control
                        type="password"
                        id="passwordAgain"
                    />
                    <div className="form-group form-inline">
                        <Form.Label>Olen lukenut ja hyväksyn&nbsp;{<a href="#" onClick={() => setShowModal(true)}>käyttöehdot</a>//eslint-disable-line
                        }:&nbsp;</Form.Label>
                        <Form.Check type="checkbox" label="" id="acceptCheckBox" value={accept} onChange={() => setAccept(!accept)} />
                    </div>
                    <Button id="submit" variant="primary" type="submit">
                        Rekisteröidy
                    </Button>
                </Form.Group>
            </Form>
            <Modal show={showModal} size="lg" onHide={() => setShowModal(false)} >
                <Modal.Header closeButton></Modal.Header>
                <Modal.Body >
                    <GDBRText></GDBRText>
                </Modal.Body>
            </Modal>
        </div>
    )
}

export default Register
