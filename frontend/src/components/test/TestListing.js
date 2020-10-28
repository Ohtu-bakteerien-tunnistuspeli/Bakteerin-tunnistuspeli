import React, { useState } from 'react'
import { Button } from 'react-bootstrap'
import ModalImage from '../ModalImage'
import TestEditForm from './TestEditForm'
import { useSelector } from 'react-redux'

const TestListing = ({ test }) => {
    const [isModified, setIsModified] = useState(false)
    const [show, setShow] = useState(false)

    const stopModify = () => {
        setIsModified(false)
        setShow(false)
    }

    const user = useSelector(state => state.user)
    const bacteria = useSelector(state => state.bacteria)?.sort((bacterium1, bacterium2) => bacterium1.name.localeCompare(bacterium2.name))

    function startModify ()  {
        setIsModified(true)
        setShow(true)
    }

    return (
        <tr key={test.id}>
            <td>{test.name}</td>
            <td>{test.type}</td>
            <td> {test.controlImage ? <ModalImage imageUrl={test.controlImage.url} width={'30%'} height={'30%'} /> : <></>} </td>
            <td> {test.positiveResultImage ? <ModalImage imageUrl={test.positiveResultImage.url} width={'30%'} height={'30%'} /> : <></>} </td>
            <td>{test.negativeResultImage ? <ModalImage imageUrl={test.negativeResultImage.url} width={'30%'} height={'30%'} /> : <></>} </td>
            {isModified ?
                <td>
                    <TestEditForm test={test} show={show} handleHide={stopModify} stopModify={stopModify} bacteria={bacteria} />
                </td>
                :
                <>
                    { user?.admin ?
                        <>
                            <td> <Button variant='primary' style={{ float: 'right' }} id='edit' onClick={() => startModify()}>Muokkaa</Button> </td>
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