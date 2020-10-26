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
                    <td>{credit.student.studentNumber}</td>
                    <td>{credit.student.name}</td>
                    <td>{credit.student.classGroup}</td>
                    <td>
                        <Button id="creditShowLink" variant='primary' onClick={handleShow}>Näytä suoritukset</Button>
                        <Modal show={show} size="lg" onHide={handleClose} >
                            <Modal.Header closeButton></Modal.Header>
                            <Modal.Body>
                                Opiskelija numero: {credit.student.studentNumber}<br />
                                Käyttäjänimi: {credit.student.name}<br />
                                Vuosikurssi: {credit.student.classGroup}<br />
                                Sähköposti: {credit.student.email}<br />
                                Suoritukset:
                                <Table>
                                    <tbody>
                                        {credit.completedCases.map(completedCase =>
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
