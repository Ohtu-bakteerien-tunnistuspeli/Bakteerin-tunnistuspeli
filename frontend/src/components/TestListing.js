import React, { useState } from 'react'
import { Button, Table } from 'react-bootstrap'
import ModalImage from './ModalImage'
import TestEditForm from './TestEditForm'
import { deleteTest, updateTest } from '../reducers/testReducer'
import { useSelector, useDispatch } from 'react-redux'

const TestListing = () => {
    const [isModified, setIsModified] = useState(false)
    const stopModify = () => {
    setIsModified(false)
    }
    const tests = useSelector(state => state.test)?.sort((test1, test2) => test1.name.localeCompare(test2.name))
    const user = useSelector(state => state.user)
    const dispatch = useDispatch()
    const deleteTests = test => {
        dispatch(deleteTest(test, user.token))
    }
    const updateTests = (id, name, type, contImg, photoPos, photoNeg, bacteriaSpecificImg, token) => {
        dispatch(updateTest(id, name, type, contImg, photoPos, photoNeg, bacteriaSpecificImg, user.token))
    }

return (
    <div> 
        <Table striped bordered hover>
        <thead>
        <tr>
            <th>Nimi</th>
            <th>Tyyppi</th>
            <th>Kontrollikuva</th>
            <th>Positiivinen oletus</th>
            <th>Negatiivinen oletus</th>
            <th></th>
            <th></th>
        </tr>
    </thead>
       {tests.map(test =>
            <tbody key={test.id}>
                <tr key={test.id}>
                <td>{test.name}</td> 
                <td>{test.type}</td>
                <td> {test.positiveResultImage ? <ModalImage imageUrl={test.positiveResultImage.url} width={'10%'} height={'10%'}/>: <></>} </td>
                <td>{test.negativeResultImage ? <ModalImage imageUrl={test.negativeResultImage.url} width={'10%'} height={'10%'}/> : <></>} </td>
                <td> {test.controlImage ? <ModalImage imageUrl={test.controlImage.url} width={'10%'} height={'10%'}/> : <></>} </td>
            {/* console.log(test) */}
            {isModified ?
                <td>
                    <TestEditForm test={ test } stopModify={ stopModify } />
                    <Button variant='secondary' id='stopEdit' style={{ float: 'right' }} onClick={stopModify}>Lopeta muokkaus</Button>
                </td>
                    :
                <>
            { user?.admin ?
                <>
                    <td> <Button variant='danger' style={{ float: 'right' }} id='delete' onClick={() => deleteTests(test)}>Poista</Button> </td>
                    <td> <Button variant='primary' style={{ float: 'right' }} id='edit' onClick={() => setIsModified(true)}>Muokkaa</Button> </td>
                </>
                    :
                <></>
            }
                </>
                }
            </tr>
        </tbody>
        )}
        </Table>
    </div> 
    )
}

export default TestListing