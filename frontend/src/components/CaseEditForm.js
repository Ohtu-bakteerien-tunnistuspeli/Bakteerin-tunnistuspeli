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

    const updateCase = (event) => {
        event.preventDefault()
        console.log('do the update here')
        console.log(`new name ${caseName}`)
        console.log(`new anamnesis ${caseAnamnesis}`)
        console.log(`new bacterium ${bacterium.name}`)
        console.log(`new samples ${samples.map(s => s.description)}`)
    }

    /* case name control*/
    const [caseName, setCaseName] = useState(c.name)
    const handleCaseNameChange = (event) => setCaseName(event.target.value)
    /* case name control end */

    /* case anamnesis control */
    const [caseAnamnesis, setCaseAnamnesis] = useState(c.anamnesis)
    const handleAnamnesisChange = (event) => setCaseAnamnesis(event.target.value)
    /*case anamnesis control end */

    /*bacterium control*/
    const bacteria = useSelector(state => state.bacteria).sort((bacterium1, bacterium2) => bacterium1.name.localeCompare(bacterium2.name))
    const [bacterium, setBacterium] = useState(c.bacterium)
    const handleBacteriumChange = (event) => setBacterium(bacteria.find(bac => bac.id === event.target.value))
    /* bacterium control end */

    /* samples control*/
    const [samples, setSamples] = useState(c.samples)
    const deleteSample = (sample2) => {
        console.log(samples)
        setSamples(samples.filter(s => s.description !== sample2.description))
    }
    const [sample, setSample] = useState(null)
    const handleSample = (event) => {
/*ei toimi vielä*/
        if (sample === null) {
            const newSample = {
                description: ``,
                rightAnswer: false
            }
            setSample(newSample)
        }
        if (event.target.checked) {
            setSample({...sample, rightAnswer: true})
        }else if (event.target.value !== 'on') {
            const newSample = {
                description: `${event.target.value}`,
                rightAnswer: false
            }
            setSample(newSample)
        } 
    }
    const addSample = (event) => {
        event.preventDefault()
        setSamples(samples.concat(sample))
    }
    /* samples control end */

    const [testGroups] = useState(c.testGroups)
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
                <Form onSubmit={updateCase} >

                    <Form.Label>Nimi:</Form.Label><br></br>
                    <Form.Control onChange={handleCaseNameChange} defaultValue={c.name} /><br></br>

                    <Form.Label>Anamneesi:</Form.Label><br></br>
                    <Form.Control onChange={handleAnamnesisChange} defaultValue={c.anamnesis} /><br></br>

                    <Form.Label>Bakteeri:</Form.Label><br></br>
                    <Form.Control as="select" onChange={handleBacteriumChange} defaultValue={bacterium.name}>
                        {bacteria.map(bacterium =>
                            <option key={bacterium.id} value={bacterium.id}>{bacterium.name}</option>
                        )}
                    </Form.Control><br></br>

                    <Form.Label>Näytevaihtoehdot</Form.Label><br></br>
                    {samples.map(s =>
                        <Sample key={s.description}
                            sample={s}
                            sampleChange={deleteSample} >
                        </Sample>
                    )}
                    <Form.Control onChange={handleSample} placeholder="Näytteen kuvaus" />
                    <Form.Check onChange={handleSample} type="checkbox" label="Oikea vastaus" />
                    <Button onClick={addSample}>Lisää näytevaihtoehto</Button><br></br>

                    <Form.Label> Testiryhmät</Form.Label>
                    {testGroups.map((tg, i) =>
                        <TestGroup key={i}
                            testgroup={tg}
                            index={i}
                            isRequredChange={sampleAnswer.onChange}
                            positiveChange={sampleAnswer.onChange}
                            alternativeTestsChange={sampleAnswer.onChange}
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