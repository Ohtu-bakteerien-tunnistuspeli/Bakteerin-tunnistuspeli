import React from 'react'
import { useSelector } from 'react-redux'
import TestForm from './TestForm'
import TestListing from './TestListing'
import { Table } from 'react-bootstrap'

const TestList = () => {
    const style = { margin: '10px', fontSize: '40px' }
    const tests = useSelector(state => state.test)?.sort((test1, test2) => test1.name.localeCompare(test2.name))
    const user = useSelector(state => state.user)

    return (
        <div>
            <h2 style={style}>Testit</h2>
            <p></p>
            {user?.admin ?
                <TestForm></TestForm>
                :
                <></>
            }
            {tests.length !== 0 ?
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>Nimi</th>
                            <th>Tyyppi</th>
                            <th>Kontrollikuva</th>
                            <th>Positiivinen oletus</th>
                            <th>Negatiivinen oletus</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {tests.map(test =>
                            <TestListing key={test.id} test={test}></TestListing>
                        )}
                    </tbody>
                </Table>
                :
                <div>Ei Testejä</div>
            }
        </div>
    )
}

export default TestList
