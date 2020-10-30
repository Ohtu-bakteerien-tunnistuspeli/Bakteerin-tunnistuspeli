import React from 'react'
import { Form } from 'react-bootstrap'

const NameAndType = ({ nameControlId, typeControlId, TestName, TestType }) => {
    return (
        <>
            <Form.Group controlId={nameControlId}>
                <Form.Label>Nimi</Form.Label>
                <Form.Control type={TestName.type} value={TestName.value} onChange={TestName.onChange} reset='' />
            </Form.Group>
            <Form.Group controlId={typeControlId}>
                <Form.Label>Tyyppi</Form.Label>
                <Form.Control as='select' type={TestType.type} value={TestType.value} onClick={TestType.onChange} onChange={TestType.onChange}>
                    <option key='1' value='' disabled hidden>Valitse testin tyyppi</option>
                    <option key='2' value='Värjäys'>Värjäys</option>
                    <option key='3' value='Testi'>Testi</option>
                    <option key='4' value='Viljely'>Viljely</option>
                </Form.Control>
            </Form.Group>
        </>
    )
}

export default NameAndType