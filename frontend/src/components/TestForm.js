import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { addTest } from '../reducers/testReducer'
const TestForm = () => {
    const [newTest, setNewTest] = useState('')
    const user = useSelector(state => state.user)
    const dispatch = useDispatch()
    const addTests = (event) => {
        event.preventDefault()
        dispatch(addTest(newTest, user.token))
        setNewTest('')
    }

    return (
        <div>
            <form onSubmit={addTests}>
                <input
                    id="newTest"
                    value={newTest}
                    onChange={({ target }) => setNewTest(target.value)}
                />
                <button type="submit">Lisää</button>
            </form>
        </div>
    )
}

export default TestForm