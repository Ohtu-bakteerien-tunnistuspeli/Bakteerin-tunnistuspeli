import React, { useState } from 'react'
import { Tabs, Tab, Form, Button, Table } from 'react-bootstrap'
import { Typeahead } from 'react-bootstrap-typeahead'
import { useSelector, useDispatch } from 'react-redux'
import { checkSamples, checkTests, checkBacterium } from '../reducers/gameReducer'
import ModalImage from './utility/ModalImage'
import FormattedText from './case/components/FormattedText'

const GamePage = () => {
    const [tab, setTab] = useState('anamneesi')
    const [testTab, setTestTab] = useState('testejä')
    const dispatch = useDispatch()
    const game = useSelector(state => state.game)
    const user = useSelector(state => state.user)
    const bacteria = useSelector(state => state.bacteria)?.map(bact => bact.name)
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
            dispatch(checkTests(game, testId, user.token, setTestTab))
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
                    <p style={{ padding:'20px' }}><FormattedText value={game.case.anamnesis} /></p>
                </Tab>
                <Tab eventKey='toiminnot' title='Toiminnot'>
                    <Tabs activeKey={testTab} onSelect={(k) => setTestTab(k)}>
                        <Tab eventKey='testejä' title='Testejä'>
                            {
                                !game.samplesCorrect ?
                                    <>
                                        <h1>Näytteenotto</h1>
                                        <Form id='samples' onSubmit={(event) => sampleSubmit(event)}>
                                            <Form.Label>Millaisen näytteen otat?</Form.Label>
                                            {game.case.samples.map((sample, i) => <Form.Check key={i} label={sample.description} onChange={() => sampleCheckBoxChange(sample.description)}></Form.Check>)}
                                            <Button
                                                variant='success'
                                                type='submit'
                                                id='checkSamples'
                                                className="game-margin">
                                                Ota näyte
                                            </Button>
                                        </Form>
                                    </>
                                    :
                                    <>
                                        <h1>Laboratoriotutkimukset</h1>
                                        <div id='testView'>
                                            {
                                                (cultivationsToShow && cultivationsToShow.length > 0) ?
                                                    <>
                                                        <h2>Viljelyt</h2>
                                                        {cultivationsToShow.map(test =>
                                                            <Button id='testButton' key={test.id} variant='warning' onClick={() => handleTest(test.id)}>{test.name}{game.correctTests.includes(test.id) ? <i className='fas fa-check'></i> : <></>}</Button>
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
                                                            <Button key={test.id} variant='info' onClick={() => handleTest(test.id)}>{test.name}{game.correctTests.includes(test.id) ? <i className='fas fa-check'></i> : <></>}</Button>
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
                                                            <Button key={test.id} variant='success' onClick={() => handleTest(test.id)}>{test.name}{game.correctTests.includes(test.id) ? <i className='fas fa-check'></i> : <></>}</Button>
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
                                                            <Button key={test.id} variant='secondary' onClick={() => handleTest(test.id)}>{test.name}{game.correctTests.includes(test.id) ? <i className='fas fa-check'></i> : <></>}</Button>
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
                            <h4 className="game-margin">Tulokset</h4>
                            <Table id='resultTable'>
                                <thead>
                                    <tr>
                                        <th>Testi</th>
                                        <th>Kontrollikuva</th>
                                        <th>Tulos</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {game.testResults.map((result, i) =>
                                        <tr key={i}>
                                            <td>{result.testName}</td>
                                            <td>
                                                {tests.filter(test => test.name === result.testName).map(test =>
                                                    <>
                                                        {test.controlImage ?
                                                            <ModalImage imageUrl={test.controlImage.url} width={'10%'} height={'10%'}></ModalImage>
                                                            :
                                                            <></>
                                                        }
                                                    </>
                                                )}
                                            </td>
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
                    </Tabs>
                </Tab>
                <Tab eventKey='diagnoosi' title='Diagnoosi' disabled={!game.requiredTestsDone}>
                    <h1>Diagnoosi</h1>
                    {game.bacteriumCorrect ?
                        <>
                            <p style={{ padding:'10px' }}><FormattedText value={game.case.completionText} /></p>
                            <p></p>
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
                                <Form.Group>
                                    <Form.Label>Syötä bakteerin nimi</Form.Label>
                                    <Typeahead
                                        inputProps={{ id: 'bacterium' }}
                                        value={bacterium}
                                        minLength={1}
                                        labelKey={option => option}
                                        onInputChange={(value) => setBacterium(value)}
                                        onChange={(options) => setBacterium(options[0])}
                                        filterBy={(option, props) => option.toLowerCase().startsWith(props.text.toLowerCase())}
                                        options={bacteria}
                                        emptyLabel='Vastaavia bakteereja ei löytynyt'
                                    />
                                </Form.Group>
                                <Button variant='info'
                                    type='submit'
                                    id='checkDiagnosis'>
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