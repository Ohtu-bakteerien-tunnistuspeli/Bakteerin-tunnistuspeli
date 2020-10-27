import React, { useState } from 'react'
import { Modal, Table, Button } from 'react-bootstrap'

const CreditListing = ({ credit, admin }) => {
    const handleShow = () => setShow(true)
    const handleClose = () => setShow(false)
    const [show, setShow] = useState(false)
    return (
        <tr key={credit.id}>
            {admin ?
                <>
                    <td>{credit.user.studentNumber}</td>
                    <td>{credit.user.username}</td>
                    <td>{credit.user.classGroup}</td>
                    <td>
                        <Button id="creditShowLink" variant='primary' onClick={handleShow}>Näytä suoritukset</Button>
                        <Modal show={show} size="lg" onHide={handleClose} >
                            <Modal.Header closeButton></Modal.Header>
                            <Modal.Body>
                                Opiskelija numero: {credit.user.studentNumber}<br />
                                Käyttäjänimi: {credit.user.username}<br />
                                Vuosikurssi: {credit.user.classGroup}<br />
                                Sähköposti: {credit.user.email}<br />
                                Suoritukset:
                                <Table>
                                    <tbody>
                                        {credit.testCases.map(completedCase =>
                                            <tr key={completedCase}>
                                                <td>{completedCase}</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </Table>
                            </Modal.Body>
                        </Modal>
                    </td>
                </>
                :
                <></>
            }
        </tr>
    )
}

export default CreditListing
