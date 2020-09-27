import React, { useState } from 'react'
import { ListGroup, Button } from 'react-bootstrap'

const TestListing = ({ test, deleteTest, updateTest, isAdmin }) => {
    const [isModified, setIsModified] = useState(false)
    const [newName, setNewName] = useState('')
    const modify = () => {
        if (newName) {
            updateTest(newName, test.id)
            setIsModified(false)
            setNewName('')
        }
    }
    const stopModify = () => {
        setIsModified(false)
        setNewName('')
    }
    return (
        <ListGroup>
            <ListGroup.Item key={test.id}>
                {test.name}
                { console.log(test) }
                {isModified ?
                    <>
                        {/* tähän varmaan tulisi sitten tilalle, että avaa TestEditFormin,
                        eli jtn <TestEditForm test={test} /> */}
                        <input value={newName} id='editField' onChange={({ target }) => setNewName(target.value)} />
                        <Button variant='secondary' id='stopEdit' style={{ float: 'right' }} onClick={stopModify}>Lopeta muokkaus</Button>
                        <Button variant='primary' id='saveEdit' style={{ float: 'center' }} onClick={modify}>Muuta nimi</Button>
                    </>
                    :
                    <>
                        {isAdmin ?
                            <>
                                <Button variant='danger' style={{ float: 'right' }} id='delete' onClick={() => deleteTest(test)}>Poista</Button>
                                <Button variant='primary' style={{ float: 'right' }} id='edit' onClick={() => setIsModified(true)}>Muokkaa</Button>
                            </>
                            :
                            <></>
                        }
                    </>
                }
            </ListGroup.Item>
        </ListGroup>
    )
}

export default TestListing