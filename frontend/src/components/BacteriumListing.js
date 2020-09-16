import React, { useState } from 'react'
import { ListGroup, Button } from 'react-bootstrap'

const BacteriumListing = ({ bacterium, deleteBact, updateBact, isAdmin }) => {
    const [isModified, setIsModified] = useState(false)
    const [newName, setNewName] = useState('')
    const modify = () => {
        if (newName) {
            updateBact(newName, bacterium.id)
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
            <ListGroup.Item key={bacterium.id}>
                {bacterium.name}
                {isModified ?
                    <>
                        <input value={newName} id='editField' onChange={({ target }) => setNewName(target.value)} />
                        <Button variant='secondary' id='stopEdit' style={{ float: 'right' }} onClick={stopModify}>Lopeta muokkaus</Button>
                        <Button variant='primary' id='saveEdit' style={{ float: 'center' }} onClick={modify}>Muuta nimi</Button>
                    </>
                    :
                    <>
                        {isAdmin ?
                            <>
                                <Button variant='danger' style={{ float: 'right' }} id='delete' onClick={() => deleteBact(bacterium)}>Poista</Button>
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

export default BacteriumListing