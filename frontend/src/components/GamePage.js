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
    const tests = useSelector(state => state.test)
    /*
    const types = tests.map(test => test.type)
    types.reduce(function(a,b){
        if(a.indexOf(b)<0)a.push(b)
        return a
    },[])
    */
    const testsToShow = tests.filter(test => test.type === 'Testi')
    const cultivationsToShow = tests.filter(test => test.type === 'Viljely')
    const stainingsToShow = tests.filter(test => test.type === 'Värjäys')
    const othersToShow = tests.filter(test => test.type !== 'Testi' && test.type !== 'Viljely' && test.type !== 'Värjäys')

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

    const handleTest = (testId) => {
        console.log(testId)
        console.log([...game.correctTests, testId])
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
                                        <div style={{ backgroundColor: "#F5F5F5" }}>
                                            {
                                                (cultivationsToShow && cultivationsToShow.length > 0) ?
                                                    <>
                                                        <h2>Viljelyt</h2>
                                                        {cultivationsToShow.map(test =>
                                                            <Button key={test.id} variant='warning' onClick={() => handleTest(test.id)}>{test.name}{game.correctTests.includes(test.id) ? <i className="fas fa-check"></i> : <></>}</Button>
                                                        )}
                                                    </>
                                                    :
                                                    <></>
                                            }
                                            {
                                                (testsToShow && testsToShow.length > 0) ?
                                                    <>
                                                        <h2>Testit</h2>
                                                        {testsToShow.map(test =>
                                                            <Button key={test.id} variant='info' onClick={() => handleTest(test.id)}>{test.name}{game.correctTests.includes(test.id) ? <i className="fas fa-check"></i> : <></>}</Button>
                                                        )}
                                                    </>
                                                    :
                                                    <></>
                                            }
                                            {
                                                (stainingsToShow && stainingsToShow.length > 0) ?
                                                    <>
                                                        <h2>Värjäys</h2>
                                                        {stainingsToShow.map(test =>
                                                            <Button key={test.id} variant='success' onClick={() => handleTest(test.id)}>{test.name}{game.correctTests.includes(test.id) ? <i className="fas fa-check"></i> : <></>}</Button>
                                                        )}
                                                    </>
                                                    :
                                                    <></>
                                            }
                                            {
                                                (othersToShow && othersToShow.length > 0) ?
                                                    <>
                                                        <h2>Muut</h2>
                                                        {othersToShow.map(test =>
                                                            <Button key={test.id} variant='secondary' onClick={() => handleTest(test.id)}>{test.name}{game.correctTests.includes(test.id) ? <i className="fas fa-check"></i> : <></>}</Button>
                                                        )}
                                                    </>
                                                    :
                                                    <></>
                                            }
                                        </div>
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