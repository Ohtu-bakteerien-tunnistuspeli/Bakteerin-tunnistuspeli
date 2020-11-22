import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import TestForm from './TestForm'
import TestListing from './TestListing'
import { Table } from 'react-bootstrap'

const TestList = () => {
    const tests = useSelector(state => state.test)?.sort((test1, test2) => test1.name.localeCompare(test2.name))
    const user = useSelector(state => state.user)
    const [testsToShow, setTestsToShow] = useState(tests)
    const [filterByTestName, setFilterByTestName] = useState('')
    const [filterByTestType, setFilterByTestType] = useState('')

    useEffect(() => {
        if(filterByTestName === '' && filterByTestType === '') {
            setTestsToShow(tests)
        } else {
            if(filterByTestName === '') {
                setTestsToShow(tests.filter(test => test.type && test.type.startsWith(filterByTestType)))
            } else if (filterByTestType === '') {
                setTestsToShow(tests.filter(test => test.name && test.name.startsWith(filterByTestName)))
            } else {
                setTestsToShow(tests.filter(test => test.name && test.name.startsWith(filterByTestName) && test.type && test.type.startsWith(filterByTestType)))
            }
        }
    }, [filterByTestName, filterByTestType, tests])

    return (
        <div>
            Filtteröi nimellä <input id='testNameFilter' type='text' value={filterByTestName} onChange={({ target }) => setFilterByTestName(target.value)}></input>&nbsp;
            Filtteröi tyypillä <input id='testTypeFilter' type='text' value={filterByTestType} onChange={({ target }) => setFilterByTestType(target.value)}></input>&nbsp;
            <h2>Testit</h2>
            {tests.length !== 0 ?
                <Table borderless hover>
                    <thead>
                        <tr>
                            <th>Nimi</th>
                            <th>Tyyppi</th>
                            <th>Kontrollikuva</th>
                            <th>Positiivinen oletus</th>
                            <th>Negatiivinen oletus</th>
                            <th>
                                {user?.admin ?
                                    <TestForm></TestForm>
                                    :
                                    <></>
                                }
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {testsToShow.map(test =>
                            <TestListing key={test.id} test={test}></TestListing>
                        )}
                    </tbody>
                </Table>
                :
                <>
                    {user?.admin ?
                        <TestForm></TestForm>
                        :
                        <></>
                    }
                    <div>Ei Testejä</div>
                </>
            }
        </div>
    )
}

export default TestList
