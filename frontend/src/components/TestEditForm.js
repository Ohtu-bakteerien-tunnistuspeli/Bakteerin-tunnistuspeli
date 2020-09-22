import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { deleteTest, updateTest } from '../reducers/testReducer'

const TestEditForm = (test) => {
    const [newName, setNewName] = useState('')
    const [newType, setNewType] = useState('')
    const [photoPos, setPhotoPos] = useState([])
    const [photoNeg, setPhotoNeg] = useState([])
    const user = useSelector(state => state.user)
    const dispatch = useDispatch()

    // Get info of this test from parameter 'test'
    // and set that info as staring value for fields
    // Get test.id from parameter 'test'

    const removeTest = () => {
        dispatch(deleteTest(test.id, user.token))
    }
    const editTest = () => {
        dispatch(updateTest(newName, newType, photoPos, PhotoNeg, user.token))
    }

    return (
        <div>
            <button id='deleteTest' onClick={ removeTest }>POISTA testi</button>
            <p></p>
            <Form onSubmit={ editTest }>
                <p>Uusi nimi</p>
                <input
                    id='editTestName'
                    value={ newName }
                    onChange={ ({ target }) => setNewName(target.value.name) }
                />
                <p>Uusi tyyppi</p>
                <select
                    id='editTestType'
                    value={ newType }
                    onChange={ ({ target }) => setNewType(target.value.type) }
                >
                    <option value='viljely'>Viljely</option>
                    <option value="testi">Testi</option>
                </select>
                <p>Positiivinen oletuskuva</p>
                <input
                    id='editTestPosImg'
                    value= { photoPos }
                    type='file'
                    onChange={ ({ target }) => setPhotoPos(target.value.posImage) }
                />
                <p>Negatiivinen oletuskuva</p>
                <input
                    id='editTestNegImg'
                    value= { photoNeg }
                    type='file'
                    onChange={ ({ target }) => setPhotoNeg(target.value.negImage) }
                />
                <button type='submit'>Tallenna muutokset</button>
            </Form>
        </div>
    )
}

export default TestEditForm