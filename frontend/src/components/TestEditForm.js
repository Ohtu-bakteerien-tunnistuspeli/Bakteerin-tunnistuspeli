import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { deleteTest, updateTest } from '../reducers/testReducer'

const TestEditForm = () => {
    const [newName, setNewName] = useState('')
    const [newType, setNewType] = useState('')
    const user = useSelector(state => state.user)
    const dispatch = useDispatch()

    // Add function to get previous info of this test
    // and fill fields with that info

    const removeTest = test => {
        dispatch(deleteTest(test, user.token))
    }
    const editTest = test => {
        dispatch(updateTest(test, user.token))
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
                <button type='submit'>Tallenna muutokset</button>
            </Form>
        </div>
    )
}

export default TestEditForm