import React from 'react'
import { Modal } from 'react-bootstrap'

const ModalComponent = ({ title, show, handleClose }) => {
    <Modal show={show} size='lg' onHide={handleClose} >
        <Modal.Header closeButton></Modal.Header>
        <Modal.Body>

        </Modal.Body>
    </Modal>
}

export default ModalComponent