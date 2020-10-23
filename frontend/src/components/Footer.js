import React, { useState } from 'react'
import { Modal } from 'react-bootstrap'
import GDBRText from './user/GDPRText'
import PrivacyText from './user/PrivacyText'

const Footer = () => {
    const [showGDPR, setShowGDPR] = useState(false)
    const [showPrivacy, setShowPrivacy] = useState(false)

    return (
        <div className="container">
            <p className="navbar-text">© Copyright 2020 ...
                &nbsp;{<a href="#" onClick={() => setShowGDPR(true)}>Käyttöehdot</a>//eslint-disable-line
                }&nbsp;
                ja&nbsp;{<a href="#" onClick={() => setShowPrivacy(true)}>Tietosuojailmoitus</a> //eslint-disable-line
                }&nbsp;
            </p>
            <Modal show={showGDPR} size="lg" onHide={() => setShowGDPR(false)} >
                <Modal.Header closeButton></Modal.Header>
                <Modal.Body >
                    <GDBRText></GDBRText>
                </Modal.Body>
            </Modal>
            <Modal show={showPrivacy} size="lg" onHide={() => setShowPrivacy(false)} >
                <Modal.Header closeButton></Modal.Header>
                <Modal.Body >
                    <PrivacyText></PrivacyText>
                </Modal.Body>
            </Modal>
        </div>
    )
}

export default Footer