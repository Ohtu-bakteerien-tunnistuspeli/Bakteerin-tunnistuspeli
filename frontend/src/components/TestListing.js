import React, { useState } from 'react'
import { ListGroup, Button } from 'react-bootstrap'
import ModalImage from './ModalImage'
import TestEditForm from './TestEditForm'

const TestListing = ({ test, deleteTest, isAdmin }) => {
    const [isModified, setIsModified] = useState(false)
    const stopModify = () => {
        setIsModified(false)
    }   
    return (
        <ListGroup>
            <ListGroup.Item key={test.id}>
                {test.name} {test.type} {test.positiveResultImage ? <ModalImage imageUrl={test.positiveResultImage.url} width={'10%'} height={'10%'}/>: <></>}
                {test.negativeResultImage ? <ModalImage imageUrl={test.negativeResultImage.url} width={'10%'} height={'10%'}/> : <></>}
                {test.controlImage ? <ModalImage imageUrl={test.controlImage.url} width={'10%'} height={'10%'}/> : <></>}
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