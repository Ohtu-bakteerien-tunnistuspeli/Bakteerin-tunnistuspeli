import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { deleteTest, updateTest } from '../reducers/testReducer'

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
            <button id='deleteTest' onClick={ removeTest }>POISTA testi</button>
            <p></p>
            <form onSubmit={ editTest }>
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
                <p>Kontrollikuva</p>
                <input
                    id='editCtrlImg'
                    value= { photoControl }
                    type='file'
                    onChange={ ({ target }) => setPhotoControl(target.value.controlImage) }
                />
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
            </form>
        </div>
    )
}

export default TestEditForm
