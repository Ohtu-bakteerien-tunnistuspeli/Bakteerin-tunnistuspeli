import React, { useState } from 'react'
import Sample from '../components/Sample.js'
import TestGroup from '../components/TestGroup.js'
import { useSelector } from 'react-redux'
import { Modal, Button, Form } from 'react-bootstrap'

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
        console.log(`new samples ${samples.map(s => [s.description, s.rightAnswer])} `)
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
    const[newSampleName, setNewSampleName] = useState('')
    const[newSampleRightAnswer, setNewSampleRightAnswer] = useState(false)
    const handleNewSampleName = (event) => setNewSampleName(event.target.value)
    const handleNewSampleRightAnswer = (event) => setNewSampleRightAnswer(!newSampleRightAnswer)

    const addSample = (event) => {
        event.preventDefault()
        const newSample = {
            description: newSampleName,
            rightAnswer: newSampleRightAnswer
        }
        setSamples(samples.concat(newSample))
        setNewSampleName('')
        setNewSampleRightAnswer(false)
        
    }
    /* samples control end */
    
    /* testgroup control1 */
    const tests = useSelector(state => state.test)?.sort((test1, test2) => test1.name.localeCompare(test2.name))
    console.log(tests)
    const [testGroups, setTestGroups] = useState(c.testGroups)
    const [newTestGroup, setNewTestGroup] = useState(null)
    const [newTest, setNewTest] = useState(tests[0])
    const [isRequired, setIsRequired] = useState(false)
    const [positive, setPositive] = useState(false)
    const [alternativeTests, setSetAltervativeTests] = useState(false)

    const addTest = (testgroup) => {
    console.log(newTest.name)
    console.log(isRequired)
    console.log(positive)
    console.log(alternativeTests)
    const newTestgroup = testgroup.concat({test: newTest, 
        isRequired: isRequired, 
        positive: positive, 
        alternativeTests: alternativeTests})
    const copyOfTestGroups = testGroups
    copyOfTestGroups[testGroups.indexOf(testgroup)]=newTestgroup
    setTestGroups(copyOfTestGroups)
   // setTestGroups([...testGroups, testGroups[testGroups.indexOf(testgroup)] = newTestGroup])
    }
    const handleTestChange = (event) => setNewTest(tests.find(t => t.id ===event.target.value))
    const handleIsRequiredChange = (event) => setIsRequired(!isRequired)
    const handlePositiveChange = (event) => setPositive(!positive)
    const handleAlternativeTests = (event) => setSetAltervativeTests(!alternativeTests)
    /* testgroup control end */
    
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
                    <Form.Control as="select" onChange={handleBacteriumChange} value={bacterium.id}>
                        {bacteria.map(bac =>
                            <option key={bac.id} value={bac.id}>{bac.name}</option>
                        )}
                    </Form.Control><br></br>

                    <Form.Label>Näytevaihtoehdot</Form.Label><br></br>
                    {samples.map(s =>
                        <Sample key={s.description}
                            sample={s}
                            sampleChange={deleteSample} >
                        </Sample>
                    )}
                    <Form.Control onChange={handleNewSampleName} 
                                  placeholder="Näytteen kuvaus" 
                                  value={newSampleName}/>
                    <Form.Check onChange={handleNewSampleRightAnswer} 
                                type="checkbox" 
                                label="Oikea vastaus" 
                                checked={newSampleRightAnswer}/>
                    <Button onClick={addSample}>Lisää näytevaihtoehto</Button><br></br>

                    <Form.Label> Testiryhmät</Form.Label>
                    {testGroups.map((tg, i) =>
                        <TestGroup key={i}
                            testgroup={tg}
                            index={i}
                            tests = {tests}
                            testChange = {handleTestChange}
                            isRequired = {isRequired}
                            isRequiredChange={handleIsRequiredChange}
                            positive = {positive}
                            positiveChange={handlePositiveChange}
                            alternativeTests={alternativeTests}
                            alternativeTestsChange={handleAlternativeTests}
                            addTest={addTest}
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