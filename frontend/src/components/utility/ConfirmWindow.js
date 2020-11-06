import React, { useState } from 'react'
import { Modal, Button, Form } from 'react-bootstrap'

const ConfirmWindow = ({ listedUser, buttonId, modalOpenButtonText, modalOpenButtonVariant, modalHeader, warningText, functionToExecute, executeButtonText, executeButtonVariant }) => {
    const [confirmText, setConfirmText] = useState('')
    const [show, setShow] = useState(false)
    const handleShow = () => setShow(true)
    const handleClose = () => setShow(false)
    return (
        <>
            <Button variant={modalOpenButtonVariant} 
            style={{ margin: '2px' }} 
            id={buttonId} 
            onClick={handleShow}>{modalOpenButtonText}</Button>
            <Modal show={show} size='lg' scrollable='true' onHide={handleClose}>
                <Modal.Header closeButton>
                    {modalHeader}
                </Modal.Header>
                <Modal.Body>
                    <Form.Label>{warningText}</Form.Label>
                    <Form.Control
                        type="text"
                        id="confirmField"
                        onChange={(event) => setConfirmText(event.target.value)}
                    />
                    <Button id="confirm" variant={executeButtonVariant} type="button" disabled={confirmText !== listedUser.username} onClick={() => {
                        functionToExecute(listedUser)
                        handleClose()
                    }}>{executeButtonText}</Button>
                </Modal.Body>
            </Modal>
        </>
    )
}

export default ConfirmWindow