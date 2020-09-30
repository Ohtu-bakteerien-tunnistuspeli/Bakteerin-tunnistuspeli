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
                {test.name} {test.type} {test.positiveResultImage ? <ModalImage imageData={test.positiveResultImage.data.data} imageType={test.positiveResultImage.contentType} width={'10%'} height={'10%'}/>: <></>}
                {test.negativeResultImage ? <ModalImage imageData={test.negativeResultImage.data.data} imageType={test.negativeResultImage.contentType} width={'10%'} height={'10%'}/> : <></>}
                {test.controlImage ? <ModalImage imageData={test.controlImage.data.data} imageType={test.controlImage.contentType} width={'10%'} height={'10%'}/> : <></>}
                { console.log(test) }
                {isModified ?
                    <>
                        <TestEditForm test={test} />
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