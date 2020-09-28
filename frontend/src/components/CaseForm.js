import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { addCase } from '../reducers/caseReducer'
import { Modal, Button, ButtonGroup, Form, ListGroup } from 'react-bootstrap'

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
    const bacteria = useSelector(state => state.bacteria).sort((bacterium1, bacterium2) => bacterium1.name.localeCompare(bacterium2.name))
    //const tests = useSelector(state => state.test)?.sort((test1, test2) => test1.name.localeCompare(test2.name))
    const tests = [{ id: '1a2b', name: 'testi1' }, { id: '3c4d', name: 'testi2' }]
    const user = useSelector(state => state.user)

    const caseName = useField('text')
    const [bacterium, setBacterium] = useState(bacteria[0])
    const anamnesis = useField('text')
    const compText = useField('text')
    const [sample, setSample] = useState({ name: '', rightAnswer: false })
    const [samples, setSamples] = useState([])
    const [testForCase, setTestForCase] = useState({ test: tests[0], required: false, positive: false, alternativeTests: false })
    const [testGroup, setTestGroup] = useState([])
    const [testGroups, setTestGroups] = useState([])

    const dispatch = useDispatch()

    const addNewCase = (event) => {
        event.preventDefault()
        dispatch(addCase(caseName, bacterium, anamnesis, compText, samples, testGroups, user.token))
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

    const addTestGroup = () => {
        setTestGroups([...testGroups, testGroup])
        setTestGroup([])
    }
    // caseName, bacterium, anamnesis, compText, samples, testGroups

    return (
        <div>
            <Button variant="primary" onClick={handleShow}>
                Luo uusi tapaus
            </Button>
            <Modal show={show} size="lg" onHide={handleClose} >
                <Modal.Header closeButton></Modal.Header>
                <Modal.Body>
                    <Form onSubmit={addNewCase}>
                        <Form.Group controlId="name">
                            <Form.Label>Nimi</Form.Label>
                            <Form.Control onChange={caseName.onChange} />
                        </Form.Group>
                        <Form.Group controlId="bacterium">
                            <Form.Label>Bakteeri</Form.Label>
                            <Form.Control as="select" onChange={(event) => setBacterium(JSON.parse(event.target.value))}>
                                {bacteria.map(bacterium =>
                                    <option key={bacterium.id} value={JSON.stringify(bacterium)}>{bacterium.name}</option>
                                )}
                            </Form.Control>
                        </Form.Group>
                        <Form.Group controlId="anamnesis">
                            <Form.Label>Anamneesi</Form.Label>
                            <Form.Control as="textarea" rows="3" onChange={anamnesis.onChange} />
                        </Form.Group>
                        <Form.Group controlId="completitionText">
                            <Form.Label>Lopputeksti</Form.Label>
                            <Form.Control as="textarea" rows="3" onChange={compText.onChange} />
                        </Form.Group>
                        <Form.Group controlId="samples">
                            <Form.Label>Näytevaihtoehdot</Form.Label>
                            <Form.Control value={sample.name} onChange={({ target }) => setSample({ ...sample, name: target.value })} />
                            <Form.Check type="checkbox" label="Oikea vastaus" onChange={() => setSample({ ...sample, rightAnswer: !sample.rightAnswer })} />
                            <Button type="button" onClick={() => addSample(sample.name, sample.rightAnswer)}>+</Button>
                            <ListGroup>
                                {samples.map(sample => sample.rightAnswer ?
                                    <ListGroup.Item variant="success" key={sample.name}>{sample.name}</ListGroup.Item> :
                                    <ListGroup.Item variant="danger" key={sample.name}>{sample.name}</ListGroup.Item>
                                )}
                            </ListGroup>
                            {/* Should be improved. Currently used for debugging/sanity check */}
                            {/* samples.map(sample => <p key={sample.name}>{sample.name} oikeaVastaus {sample.rightAnswer.toString()}</p>) */}
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Testiryhmät</Form.Label>
                            <Form.Control as="select" onChange={(event) => setTestForCase({ ...testForCase, test: JSON.parse(event.target.value) })}>
                                {tests.map(test =>
                                    <option key={test.id} value={JSON.stringify(test)}>{test.name}</option>
                                )}
                            </Form.Control>
                            <Form.Check type="checkbox" label="Pakollinen" onChange={() => setTestForCase({ ...testForCase, required: !testForCase.required })} />
                            <Form.Check type="checkbox" label="Positiivinen" onChange={() => setTestForCase({ ...testForCase, positive: !testForCase.positive })} />
                            <Form.Check type="checkbox" label="Vaihtoehtoinen testi" onChange={() => setTestForCase({ ...testForCase, alternativeTests: !testForCase.alternativeTests })} />
                            <ButtonGroup vertical>
                                <Button type="button" onClick={() => setTestGroup([...testGroup, testForCase])}>Lisää testi</Button>
                                {/* Should be improved. Currently used for debugging/sanity check */}
                                {testGroup.map(testForCase =>
                                    <p key={testForCase.test.id}>
                                        Nimi:{testForCase.test.name}
                                        Pakollinen: {testForCase.required.toString()}
                                        Positiivinen: {testForCase.positive.toString()}
                                        Vaihtoehtoinen: {testForCase.alternativeTests.toString()}
                                    </p>)}
                                <Button type="button" onClick={() => addTestGroup()}>Lisää testiryhmä</Button>
                                {/* Should be improved. Currently used for debugging/sanity check */}
                                <p>{JSON.stringify(testGroups)}</p>
                            </ButtonGroup>
                        </Form.Group>

                        <Button variant="primary" type="submit">
                            Lisää
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>
        </div>
    )
}

export default CaseForm