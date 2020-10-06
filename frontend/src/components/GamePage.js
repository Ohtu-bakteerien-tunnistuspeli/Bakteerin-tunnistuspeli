import React, { useState } from 'react'
import { Tabs, Tab, Form, Button } from 'react-bootstrap'
import { useSelector, useDispatch } from 'react-redux'
import { checkSamples } from '../reducers/gameReducer'
const GamePage = () => {
    const [tab, setTab] = useState('anamneesi')
    const [testTab, setTestTab] = useState('testejä')
    const dispatch = useDispatch()
    const game = useSelector(state => state.game)
    const user = useSelector(state => state.user)
    const [selectedSamples, setSelectedSamples] = useState([])
    /* Testien erottelu tyypin perusteella
    const tests = useSelector(state=>state.tests)
    */
    const sampleCheckBoxChange = (description) => {
        if (selectedSamples.includes(description)) {
            //console.log(selectedSamples.filter(sample => sample !== description))
            setSelectedSamples(selectedSamples.filter(sample => sample !== description))
        } else {
            //console.log([...selectedSamples, description])
            setSelectedSamples([...selectedSamples, description])
        }
    }
    const sampleSubmit = (event) => {
        event.preventDefault()
        dispatch(checkSamples(game, { samples: selectedSamples }, user.token))
    }

    return (
        <>
            <Tabs activeKey={tab} onSelect={(k) => setTab(k)}>
                <Tab eventKey='anamneesi' title='Anamneesi'>
                    <p>{game.case.anamnesis}</p>
                </Tab>
                <Tab eventKey='toiminnot' title='Toiminnot'>
                    <Tabs activeKey={testTab} onSelect={(k) => setTestTab(k)}>
                        <Tab eventKey='testejä' title='Testejä'>
                            {
                                !game.samplesCorrect ?
                                    <>
                                        <h1>Näytteenotto</h1>
                                        <Form onSubmit={(event) => sampleSubmit(event)} style={{ backgroundColor: "#F5F5F5" }}>
                                            <Form.Label>Millaisen näytteen otat?</Form.Label>
                                            {game.case.samples.map((sample, i) => <Form.Check key={i} label={sample.description} onChange={() => sampleCheckBoxChange(sample.description)}></Form.Check>)}
                                            <Button
                                                variant='success'
                                                type='submit'
                                                id='checkSamples'>
                                                Ota näyte
                                            </Button>
                                        </Form>
                                    </>
                                    :
                                    <>
                                        <h1>Laboratoriotutkimukset</h1>
                                    </>
                            }
                        </Tab>
                        <Tab eventKey='tuloksia' title='Tuloksia'>
                            <p>tulokset</p>
                        </Tab>
                        <Tab eventKey='kontrolleja' title='Kontrolleja'>
                            <p>Kontrollit</p>
                        </Tab>
                    </Tabs>

                </Tab>
                <Tab eventKey='diagnoosi' title='Diagnoosi' disabled={!game.requiredTestsDone}>
                    <p>Diagnoosi</p>
                </Tab>
            </Tabs>
        </>
    )
}

export default GamePage