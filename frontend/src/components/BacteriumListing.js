import React, { useState } from 'react'
import { ListGroup, Button } from 'react-bootstrap'

const BacteriumListing = ({ bacterium, deleteBact, updateBact }) => {
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
                        <input value={newName} onChange={({ target }) => setNewName(target.value)} />
                        <Button variant='secondary' style={{ float: 'right' }} onClick={stopModify}>Lopeta muokkaus</Button>
                        <Button variant='primary' style={{ float: 'center' }} onClick={modify}>Muuta nimi</Button>
                    </>
                    :
                    <>
                        <Button variant='danger' style={{ float: 'right' }} id='delete' onClick={() => deleteBact(bacterium)}>Poista</Button>
                        <Button variant='primary' style={{ float: 'right' }} id='edit' onClick={() => setIsModified(true)}>Muokkaa</Button>
                    </>
                }
            </ListGroup.Item>
        </ListGroup>
    )
}

export default BacteriumListing