import React, { useState } from 'react'
import { Tabs, Tab, Form, Button, Table } from 'react-bootstrap'
import { useSelector, useDispatch } from 'react-redux'
import { checkSamples, checkTests, checkBacterium } from '../reducers/gameReducer'
import ModalImage from './ModalImage'
const GamePage = () => {
    const [tab, setTab] = useState('anamneesi')
    const [testTab, setTestTab] = useState('testejä')
    const dispatch = useDispatch()
    const game = useSelector(state => state.game)
    const user = useSelector(state => state.user)
    const [bacterium, setBacterium] = useState('')
    const [selectedSamples, setSelectedSamples] = useState([])
    const tests = useSelector(state => state.test)?.sort((test1, test2) => test1.name.localeCompare(test2.name))
    const testsToShow = tests.filter(test => test.type === 'Testi').sort((test1, test2) => test1.name.localeCompare(test2.name))
    const cultivationsToShow = tests.filter(test => test.type === 'Viljely').sort((test1, test2) => test1.name.localeCompare(test2.name))
    const stainingsToShow = tests.filter(test => test.type === 'Värjäys').sort((test1, test2) => test1.name.localeCompare(test2.name))
    const othersToShow = tests.filter(test => test.type !== 'Testi' && test.type !== 'Viljely' && test.type !== 'Värjäys').sort((test1, test2) => test1.name.localeCompare(test2.name))

    const sampleCheckBoxChange = (description) => {
        if (selectedSamples.includes(description)) {
            setSelectedSamples(selectedSamples.filter(sample => sample !== description))
        } else {
            setSelectedSamples([...selectedSamples, description])
        }
    }

    const sampleSubmit = (event) => {
        event.preventDefault()
        dispatch(checkSamples(game, { samples: selectedSamples }, user.token))
    }

    const handleTest = (testId) => {
        if (!game.correctTests.includes(testId) && !game.allTestsDone) {
            dispatch(checkTests(game, testId, user.token))
        }
    }

    const bacteriumSubmit = (event) => {
        event.preventDefault()
        if (!game.bacteriumCorrect) {
            dispatch(checkBacterium(game, bacterium, user.token))
        }
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
                                        <Form id='samples' onSubmit={(event) => sampleSubmit(event)} style={{ backgroundColor: "#F5F5F5" }}>
                                            <Form.Label>Millaisen näytteen otat?</Form.Label>
                                            {game.case.samples.map((sample, i) => <Form.Check  key={i} label={sample.description} onChange={() => sampleCheckBoxChange(sample.description)}></Form.Check>)}
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
                                        <div id='testView' style={{ backgroundColor: "#F5F5F5" }}>
                                            {
                                                (cultivationsToShow && cultivationsToShow.length > 0) ?
                                                    <>
                                                        <h2>Viljelyt</h2>
                                                        {cultivationsToShow.map(test =>
                                                            <Button id='testButton' key={test.id} variant='warning' onClick={() => handleTest(test.id)}>{test.name}{game.correctTests.includes(test.id) ? <i className="fas fa-check"></i> : <></>}</Button>
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
                            <p>Tulokset</p>
                            <Table id='resultTable'>
                                <tbody>
                                    {game.testResults.map((result, i) =>
                                        <tr key={i}>
                                            <td>{result.testName}</td>
                                            {result.imageUrl ?
                                                <td><ModalImage imageUrl={result.imageUrl} width={'10%'} height={'10%'}></ModalImage></td>
                                                :
                                                <td></td>
                                            }
                                        </tr>
                                    )}
                                </tbody>
                            </Table>
                        </Tab>
                        <Tab eventKey='kontrolleja' title='Kontrolleja'>
                            <p>Kontrollit</p>
                            <Table id='controlImgTable'>
                                <tbody>
                                    {tests.map(test =>
                                        <tr key={test.id}>
                                            <td>{test.name}</td>
                                            {test.controlImage ?
                                                <td><ModalImage imageUrl={test.controlImage.url} width={'10%'} height={'10%'}></ModalImage></td>
                                                :
                                                <td></td>
                                            }
                                        </tr>
                                    )}
                                </tbody>
                            </Table>
                        </Tab>
                    </Tabs>

                </Tab>
                <Tab eventKey='diagnoosi' title='Diagnoosi' disabled={!game.requiredTestsDone}>
                    <h1>Diagnoosi</h1>
                    {game.bacteriumCorrect ?
                        <>
                            {game.completionImageUrl ?
                                <ModalImage imageUrl={game.completionImageUrl} width={'10%'} height={'10%'}></ModalImage>
                                :
                                <></>
                            }
                        </>
                        :
                        <>
                            <p>Syötä alla olevaan kenttään oikea diagnoosi (=bakteeri) tekemiesi testien perusteella.</p>
                            <Form onSubmit={(event) => bacteriumSubmit(event)}>
                                <Form.Group controlId="bacterium">
                                    <Form.Label>Syötä bakteerin nimi</Form.Label>
                                    <Form.Control value={bacterium} onChange={(event) => setBacterium(event.target.value)} />
                                </Form.Group>
                                <Button variant="info"
                                    type="submit"
                                    id="checkDiagnosis">
                                    Tarkasta diagnoosi
                        </Button>
                            </Form>
                        </>
                    }
                </Tab>
            </Tabs>
        </>
    )
}

export default GamePage