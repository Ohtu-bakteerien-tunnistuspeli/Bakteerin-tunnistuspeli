import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { addCase } from '../reducers/caseReducer'
import { Modal, Button, Form } from 'react-bootstrap'

const useField = (type) => {
    const [value, setValue] = useState('')
    const onChange = (event) => {
        setValue(event.target.value)
    }
    return {
        type,
        value,
        onChange
    }
}

const CaseForm = () => {

    const bacteria = useSelector(state => state.bacteria)?.sort((bacterium1, bacterium2) => bacterium1.name.localeCompare(bacterium2.name))

    const caseName = useField('text')
    const bacterium = useField('text')
    const anamnesis = useField('text')
    const compText = useField('text')
    const [sample, setSample] = useState({ name: "", rightAnswer: false })
    const [samples, setSamples] = useState([])
    const user = useSelector(state => state.user)
    const dispatch = useDispatch()
    const addCase = (event) => {
        event.preventDefault()
        //dispatch(addCase(name, bacterium, anamnesis, compText, samples, testGroups, user.token))
    }

    const [show, setShow] = useState(false)
    const handleShow = () => setShow(true)
    const handleClose = () => setShow(false)
    const addSample = (name, rightAnswer) => {
        setSamples(samples.concat({ name, rightAnswer }))
        setSample({
            ...sample,
            name: ''
        })
    }
    // name, bacterium, anamnesis, compText, samples, testGroups

    return (
        <div>
            <Button variant="primary" onClick={handleShow}>
                Luo uusi tapaus
            </Button>
            <Modal show={show} size="lg" onHide={handleClose} >
                <Modal.Header closeButton></Modal.Header>
                <Modal.Body>
                    <Form onSubmit={addCase}>
                        <Form.Group controlId="name">
                            <Form.Label>Nimi</Form.Label>
                            <Form.Control type={caseName.type} value={caseName.value} onChange={caseName.onChange} />
                        </Form.Group>
                        <Form.Group controlId="bacterium">
                            <Form.Label>Bakteeri</Form.Label>
                            <Form.Control as="select" type={bacterium.type} value={bacterium.value} onChange={bacterium.onChange}>
                                {bacteria.map(bacterium =>
                                    <option key={bacterium.id} value={bacterium.id}>{bacterium.name}</option>
                                )}
                            </Form.Control>
                        </Form.Group>
                        <Form.Group controlId="anamnesis">
                            <Form.Label>Anamneesi</Form.Label>
                            <Form.Control as="textarea" rows="3" type={anamnesis.type} value={anamnesis.value} onChange={anamnesis.onChange} />
                        </Form.Group>
                        <Form.Group controlId="completitionText">
                            <Form.Label>Lopputeksti</Form.Label>
                            <Form.Control as="textarea" rows="3" type={compText.type} value={compText.value} onChange={compText.onChange} />
                        </Form.Group>
                        <Form.Group controlId="samples">
                            <Form.Label>Näytevaihtoehdot</Form.Label>
                            <Form.Control value={sample.name} onChange={({ target }) => setSample({ ...sample, name: target.value })} />
                            <Form.Check type="checkbox" label="Oikea vastaus" onChange={({ target }) => setSample({ ...sample, rightAnswer: !sample.rightAnswer })} />
                            <Button type="button" onClick={() => addSample(sample.name, sample.rightAnswer)}>+</Button>
                            {samples.map(sample => <p key={sample.name}>{sample.name} oikeaVastaus {sample.rightAnswer.toString()}</p>)}
                        </Form.Group>
                    </Form>
                    <Button variant="primary" type="submit">
                        Lisää
                    </Button>
                </Modal.Body>
            </Modal>
        </div>
    )
}

export default CaseForm