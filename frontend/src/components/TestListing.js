import React, { useState } from 'react'
import { Button } from 'react-bootstrap'
import ModalImage from './ModalImage'
import TestEditForm from './TestEditForm'
import { useSelector } from 'react-redux'

const TestListing = ({ test }) => {
    const [isModified, setIsModified] = useState(false)
    const stopModify = () => {
        setIsModified(false)
    }

    const user = useSelector(state => state.user)
    const bacteria = useSelector(state => state.bacteria)?.sort((bacterium1, bacterium2) => bacterium1.name.localeCompare(bacterium2.name))

    return (
        <tr key={test.id}>
            <td>{test.name}</td>
            <td>{test.type}</td>
            <td> {test.controlImage ? <ModalImage imageUrl={test.controlImage.url} width={'10%'} height={'10%'} /> : <></>} </td>
            <td> {test.positiveResultImage ? <ModalImage imageUrl={test.positiveResultImage.url} width={'10%'} height={'10%'} /> : <></>} </td>
            <td>{test.negativeResultImage ? <ModalImage imageUrl={test.negativeResultImage.url} width={'10%'} height={'10%'} /> : <></>} </td>
            {isModified ?
                <td>
                    <TestEditForm test={test} stopModify={stopModify} bacteria={bacteria} />
                    <Button variant='secondary' id='stopEdit' style={{ float: 'right' }} onClick={stopModify}>Lopeta muokkaus</Button>
                </td>
                :
                <>
                    { user?.admin ?
                        <>
                            <td> <Button variant='primary' style={{ float: 'right' }} id='edit' onClick={() => setIsModified(true)}>Muokkaa</Button> </td>
                        </>
                        :
                        <></>
                    }
                </>
            }
        </tr>
    )
}

export default TestListing