import React, { useState } from 'react'
import { ListGroup, Button } from 'react-bootstrap'
import TestEditForm from './TestEditForm'

const TestListing = ({ test, deleteTest, isAdmin }) => {
    const [isModified, setIsModified] = useState(false)
    const stopModify = () => {
        setIsModified(false)
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
                {test.name} {test.type} {test.positiveResultImage ? <img src={`data:${test.positiveResultImage.contentType};base64,${positiveUrl}`} alt='positive result'/> : <></>}
                {test.negativeResultImage ? <img src={`data:${test.negativeResultImage.contentType};base64,${negativeUrl}`} alt='negative result'/> : <></>}
                {test.controlResultImage ? <img src={`data:${test.controlResultImage.contentType};base64,${controlUrl}`} alt='control'/> : <></>}
                { console.log(test) }
                {isModified ?
                    <>
                        <TestEditForm test={ test } stopModify={ stopModify } />
                        <Button variant='secondary' id='stopEdit' style={{ float: 'right' }} onClick={stopModify}>Lopeta muokkaus</Button>
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