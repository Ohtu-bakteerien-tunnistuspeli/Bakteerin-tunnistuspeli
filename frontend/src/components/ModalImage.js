import React, { useState } from 'react'
import { Image, Modal, OverlayTrigger, Tooltip } from 'react-bootstrap'
import { useDispatch } from 'react-redux'
import { setNotification } from '../reducers/notificationReducer'

const ModalImage = ({ imageUrl, width, height }) => {
    const dispatch = useDispatch()
    const [show, setShow] = useState(false)
    const handleClose = () => setShow(false)
    const handleShow = () => {
        setShow(true)
        dispatch(setNotification(''))
    }

    const style = {
        position:'absolute', padding: '0!important', margin: 0, border: 0
    }

    return (
        <>
            <OverlayTrigger placement="top" delay={{ show: 250, hide: 400 }} overlay={
                <Tooltip>Klikkaa laajentaaksesi</Tooltip>
            }>
                <Image src={`/${imageUrl}`} onClick={handleShow} style={{ maxWidth: width, maxHeight: height }}></Image>
            </OverlayTrigger>
            <Modal show={show} size='xl' onHide={handleClose} style={style} >
                <Modal.Header closeButton></Modal.Header>
                <Modal.Body style={{ alignItems: 'center', padding: '0', position: 'absolute', maxWidth: 'max-content', height: 'auto', display: 'block' }} >
                    <Image src={`/${imageUrl}`} style={{ width: '100%', height: 'auto', display: 'block' }} fluid ></Image >
                </Modal.Body>
            </Modal>
            <br />
        </>
    )
}

export default ModalImage