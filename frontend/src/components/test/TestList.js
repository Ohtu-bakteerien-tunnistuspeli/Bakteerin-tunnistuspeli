import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import TestForm from './TestForm'
import TestListing from './TestListing'
import { Table } from 'react-bootstrap'

const TestList = () => {
    const library = useSelector(state => state.language)?.library?.frontend.test.list
    const tests = useSelector(state => state.test)?.sort((test1, test2) => test1.name.localeCompare(test2.name))
    const user = useSelector(state => state.user)
    const [testsToShow, setTestsToShow] = useState(tests)
    const [filterByTestName, setFilterByTestName] = useState('')
    const [filterByTestType, setFilterByTestType] = useState('')
    const [timer, setTimer] = useState(null)
    useEffect(() => {
        if (timer) {
            clearTimeout(timer)
        }
        setTimer(setTimeout(() => {
            if (filterByTestName === '' && filterByTestType === '') {
                setTestsToShow(tests)
            } else {
                if (filterByTestName === '') {
                    setTestsToShow(tests.filter(test => test.type && test.type.startsWith(filterByTestType)))
                } else if (filterByTestType === '') {
                    setTestsToShow(tests.filter(test => test.name && test.name.startsWith(filterByTestName)))
                } else {
                    setTestsToShow(tests.filter(test => test.name && test.name.startsWith(filterByTestName) && test.type && test.type.startsWith(filterByTestType)))
                }
            }
        }, 1000))
    }, [filterByTestName, filterByTestType, tests])

    return (
        <div>
            <h2>{library.title}</h2>
            {library.filterByName}<input id='testNameFilter' type='text' value={filterByTestName} onChange={({ target }) => setFilterByTestName(target.value)}></input>&nbsp;
            {library.filterByType}<input id='testTypeFilter' type='text' value={filterByTestType} onChange={({ target }) => setFilterByTestType(target.value)}></input>&nbsp;
            {tests.length !== 0 ?
                <Table borderless hover>
                    <thead>
                        <tr>
                            <th>{library.name}</th>
                            <th>{library.type}</th>
                            <th>{library.controlImage}</th>
                            <th>{library.positiveDefault}</th>
                            <th>{library.negativeDefault}</th>
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
                    <div>{library.noTests}</div>
                </>
            }
        </div>
    )
}

export default TestList
