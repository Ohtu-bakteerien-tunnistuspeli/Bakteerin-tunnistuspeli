import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { deleteTest, updateTest } from '../reducers/testReducer'
import { Button, Form } from 'react-bootstrap'

const TestEditForm = (test) => {
    // Get info of this test from parameter 'test'
    // and set that info as staring value for fields
    const [newName, setNewName] = useState(test.name)
    const [newType, setNewType] = useState(test.type)
    const [photoPos, setPhotoPos] = useState(test.positiveResultImage)
    const [photoNeg, setPhotoNeg] = useState(test.negativeResultImage)
    const [photoControl, setPhotoControl] = useState()
    const user = useSelector(state => state.user)
    const dispatch = useDispatch()


    // Get test.id from parameter 'test'
    const removeTest = () => {
        dispatch(deleteTest(test.id, user.token))
    }
    const editTest = () => {
        dispatch(updateTest(test.id, newName, newType, photoPos, photoNeg, user.token))
    }

    return (
        <div>
            <Button variant='danger' id='deleteTest' onClick={ removeTest }>POISTA testi</Button>
            <p></p>
            <Form onSubmit={ editTest } encType="multipart/form-data">
                <p>Uusi nimi</p>
                <input
                    id='editTestName'
                    value={ newName }
                    onChange={ ({ target }) => setNewName(target.value.name) }
                />
                <p>Uusi tyyppi</p>
                <input
                    id='editTestType'
                    value={ newType }
                    onChange={ ({ target }) => setNewType(target.value.type) }
                />
                <p>Kontrollikuva</p>
                <input
                    id='editCtrlImg'
                    name='editCtrlImg'
                    value= { photoControl.image }
                    type='file'
                    onChange={ ({ target }) => setPhotoControl(target.files[0]) }
                />
                <p>Positiivinen oletuskuva</p>
                <input
                    id='editTestPosImg'
                    name='editTestPosImg'
                    value= { photoPos.image }
                    type='file'
                    onChange={ ({ target }) => setPhotoPos(target.files[0]) }
                />
                <p>Negatiivinen oletuskuva</p>
                <input
                    id='editTestNegImg'
                    name='editTestNegImg'
                    value= { photoNeg.image }
                    type='file'
                    onChange={ ({ target }) => setPhotoNeg(target.files[0]) }
                />

                {/*
                    Add bakteria specific images here
                */}

                <Button type='submit'>Tallenna muutokset</Button>
            </Form>
        </div>
    )
}

export default TestEditForm
