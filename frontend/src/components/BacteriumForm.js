import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { addBacteria } from '../reducers/bacteriaReducer'
const BacteriumForm = () => {
    const [newBacterium, setNewBacterium] = useState('')
    const user = useSelector(state => state.user)
    const dispatch = useDispatch()
    const addBacterium = (event) => {
        event.preventDefault()
        dispatch(addBacteria(newBacterium, user.token))
        console.log("Adding new bacterium:", newBacterium)
        setNewBacterium('')
    }

    return (
        <div>
            <form onSubmit={addBacterium}>
                <input
                    id="newBacterium"
                    value={newBacterium}
                    onChange={({ target }) => setNewBacterium(target.value)}
                />
                <button type="submit">Lisää</button>
            </form>
        </div>
    )
}

export default BacteriumForm