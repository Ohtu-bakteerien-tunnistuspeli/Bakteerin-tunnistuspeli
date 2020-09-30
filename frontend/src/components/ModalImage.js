import React, { useState } from 'react'
import { Image, Modal, OverlayTrigger, Tooltip } from 'react-bootstrap'
import { useDispatch } from 'react-redux'
import { setNotification } from '../reducers/notificationReducer'

const ModalImage = ({ imageData, imageType, width, height }) => {
    const dispatch = useDispatch()
    const [show, setShow] = useState(false)
    const handleClose = () => setShow(false)
    const handleShow = () => {
        setShow(true)
        dispatch(setNotification(''))
    }
    let imageUrl = btoa(String.fromCharCode.apply(null, imageData))
    
    return (
        <>
            <OverlayTrigger placement="top" delay={{ show: 250, hide: 400 }} overlay={
                <Tooltip>Klikkaa laajentaaksesi</Tooltip>
            }>
                <Image src={`data:${imageType};base64,${imageUrl}`} onClick={handleShow} style={{ maxWidth: width, maxHeight: height }}></Image>
            </OverlayTrigger>
            <Modal show={show} size="lg" onHide={handleClose} >
                <Modal.Header closeButton></Modal.Header>
                <Modal.Body style={{ alignItems: 'center', padding: '0', position: 'absolute', maxWidth: 'max-content', height: 'auto', display: 'block' }} >
                    <Image src={`data:${imageType};base64,${imageUrl}`} style={{ maxWidth: 'max-content', height: 'auto', display: 'block' }} fluid ></Image >
                </Modal.Body>
            </Modal>
            <br />
        </>
    )
}

export default ModalImage