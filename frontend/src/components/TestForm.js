import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { addTest } from '../reducers/testReducer'
const TestForm = () => {
    const [TestName, setNewTest] = useState('')
    const [TestType, setNewTestType] = useState('')
    const [photoControl, setPhotoControl] = useState([])
    const [photoPos, setPhotoPos] = useState([])
    const [photoNeg, setPhotoNeg] = useState([])
    const user = useSelector(state => state.user)
    const dispatch = useDispatch()
    const addTests = (event) => {
        event.preventDefault()
        dispatch(addTest(TestName, TestType, photoControl, photoPos, photoNeg, user.token))
        setNewTest('')
        setNewTestType('')
        setPhotoControl([])
        setPhotoPos([])
        setPhotoNeg([])
    }

    return (
        <div>
            <form onSubmit={addTests}>
                <p>Nimi</p>
                <input
                    id="TestName"
                    value={TestName}
                    onChange={({ target }) => setNewTest(target.value.name )}
                />
                <p>Tyyppi</p>
                <select
                    id="testType"
                    value={TestType}
                    onChange={({ target }) => setNewTestType(target.value.type) }>
                    <option value="viljely">Viljely</option>
                    <option value="testi">Testi</option>
                </select>
                <p>Kontrollikuva</p>
                <input
                    id="newTestControlImg"
                    value={photoControl}
                    type="file"
                    onChange={({ target }) => setPhotoControl(target.value.controlImage)}
                />
                <p>Positiivinen oletus</p>
                <input
                    id="newTestPosImg"
                    value={photoPos}
                    type="file"
                    onChange={({ target }) => setPhotoPos(target.value.posImage)}
                />
                <p>Negatiivinen oletus</p>
                <input
                    id="newTestNegImg"
                    value={photoNeg}
                    type="file"
                    onChange={({ target }) => setPhotoNeg(target.value.negImage)}
                />
                <div></div>
                <button type="submit">Lisää</button>
            </form>
        </div>
    )
}

export default TestForm
