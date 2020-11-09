import React, { useState } from 'react'
import { Image, Modal, OverlayTrigger, Tooltip } from 'react-bootstrap'
import { useDispatch } from 'react-redux'
import { setNotification } from '../../reducers/notificationReducer'

const ModalImage = ({ imageUrl }) => {
    const dispatch = useDispatch()
    const [show, setShow] = useState(false)
    const handleClose = () => setShow(false)
    const handleShow = () => {
        setShow(true)
        dispatch(setNotification(''))
    }

    return (
        <>
            <OverlayTrigger placement="top" delay={{ show: 250, hide: 400 }} overlay={
                <Tooltip>Klikkaa laajentaaksesi</Tooltip>
            }>
                <Image src={`/${imageUrl}`} onClick={handleShow} className="modal-image-preview"></Image>
            </OverlayTrigger>
            <Modal show={show} size='xl' onHide={handleClose} className="modal-image" >
                <Modal.Header closeButton></Modal.Header>
                <Modal.Body className="modal-image-container" >
                    <Image src={`/${imageUrl}`} className="modal-image-large" fluid ></Image >
                </Modal.Body>
            </Modal>
            <br />
        </>
    )
}

export default ModalImage