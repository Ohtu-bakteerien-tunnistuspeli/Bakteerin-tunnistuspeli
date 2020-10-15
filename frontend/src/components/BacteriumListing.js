import React, { useState } from 'react'
import { ListGroup, Button } from 'react-bootstrap'

const BacteriumListing = ({ bacterium, deleteBact, updateBact, isAdmin }) => {
    const [isModified, setIsModified] = useState(false)
    const [newName, setNewName] = useState('')
    const style = { marginLeft: '10px', marginRight: '10px' }
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
                        <input style={ style } value={newName} id='editField' onChange={({ target }) => setNewName(target.value)} />
                        <Button variant='secondary' id='stopEdit' style={{ float: 'right' }} onClick={stopModify}>Lopeta muokkaus</Button>
                        <Button variant='primary' id='saveEdit' style={{ float: 'center' }} onClick={modify}>Muuta nimi</Button>
                    </>
                    :
                    <>
                        {isAdmin ?
                            <>
                                <Button variant='danger' style={{ float: 'right' }} id='delete' onClick={() => deleteBact(bacterium)}>Poista
                                    <svg width="1em" height="1em" viewBox="0 0 16 16" className="bi bi-trash" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
                                        <path fillRule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4L4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
                                    </svg>
                                </Button>
                                    
                                <Button variant='primary' style={{ float: 'right', marginLeft: '10px', marginRight: '10px'  }} id='edit' onClick={() => setIsModified(true)}>Muokkaa</Button>
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