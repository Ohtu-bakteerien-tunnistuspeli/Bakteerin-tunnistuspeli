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
    let positiveUrl
    if(test.positiveResultImage) {
        positiveUrl = btoa(String.fromCharCode.apply(null, test.positiveResultImage.data.data))
    }
    let negativeUrl
    if(test.negativeResultImage) {
        negativeUrl = btoa(String.fromCharCode.apply(null, test.negativeResultImage.data.data))
    }
    let controlUrl
    if(test.controlImage) {
        controlUrl = btoa(String.fromCharCode.apply(null, test.controlImage.data.data))
    }
    
    return (
        <ListGroup>
            <ListGroup.Item key={test.id}>
                {test.name} {test.type} {test.positiveResultImage ? <img src={`data:${test.positiveResultImage.contentType};base64,${positiveUrl}`} alt-text='positive result image'/> : <></>}
                {test.negativeResultImage ? <img src={`data:${test.negativeResultImage.contentType};base64,${negativeUrl}`} alt-text='negative result image'/> : <></>}
                {test.controlResultImage ? <img src={`data:${test.controlResultImage.contentType};base64,${controlUrl}`} alt-text='control image'/> : <></>}
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