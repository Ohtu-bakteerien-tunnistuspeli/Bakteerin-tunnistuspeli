import React, { useState } from 'react'
import Sample from '../components/Sample.js'
import TestGroup from '../components/TestGroup.js'
import { useSelector } from 'react-redux'
import { Modal, Button, Form } from 'react-bootstrap'

const useField = (type) => {
    const [value, setValue] = useState('')
    const onChange = (event) => {
        setValue(event.target.value)
    }
    console.log(value)
    return {
        type,
        value,
        onChange
    }
}

const CaseEditForm = ({ c }) => {
    /* Modal config */
    const handleShow = () => setShow(true)
    const handleClose = () => setShow(false)
    const [show, setShow] = useState(false)
    /*end of modal config*/
    const caseName = useField('text')
    const caseAnamnesis = useField('text')
    const bacteria = useSelector(state => state.bacteria).sort((bacterium1, bacterium2) => bacterium1.name.localeCompare(bacterium2.name))
    const [samples ] = useState(c.samples)
    const [testGroups ] = useState(c.testGroups)
    const sampleName = useField('text')
    const sampleAnswer = useField('boolean')
    console.log(c)
    return (<div>
        <Button variant="primary" onClick={handleShow}>
            Muokkaa
            </Button>
        <Modal show={show} size="lg" onHide={handleClose} >
            <Modal.Header>Muokkaat tapausta "{c.name}"</Modal.Header>
            <Modal.Header closeButton></Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Label>Nimi:</Form.Label><br></br>
                    <Form.Control onChange={caseName.onChange} defaultValue={c.name} /><br></br>
                    <Form.Label>Anamneesi:</Form.Label><br></br>
                    <Form.Control onChange={caseAnamnesis.onChange} defaultValue={c.anamnesis} /><br></br>
                    <Form.Label>Bakteeri:</Form.Label><br></br>
                    <Form.Control as="select" onChange={(event) => setBacterium(JSON.parse(event.target.value))}>
                        {bacteria.map(bacterium =>
                            <option key={bacterium.id} value={JSON.stringify(bacterium)}>{bacterium.name}</option>
                        )}
                    </Form.Control>
                    <br></br>
                    <Form.Label>Näytevaihtoehdot</Form.Label><br></br>
                    {samples.map(s =>
                        <Sample key={s.description} 
                                sample={s} 
                                sampleChange = {sampleName.onChange} 
                                sampleAnswerChange= {sampleAnswer.onChange}>
                        </Sample>
                        )}
                    <Form.Label> Testiryhmät</Form.Label>
                    {testGroups.map((tg, i) =>
                        <TestGroup key={i} 
                                   testgroup = {tg} 
                                   index={i}
                                   isRequredChange = {sampleAnswer.onChange} 
                                   positiveChange = {sampleAnswer.onChange}
                                   alternativeTestsChange = {sampleAnswer.onChange}
                                   > 
                                   </TestGroup>
                    )}
                    <Button variant="primary" type="submit">
                        Tallenna
                    </Button>
                </Form>
            </Modal.Body>
        </Modal>
    </div>)

}

export default CaseEditForm