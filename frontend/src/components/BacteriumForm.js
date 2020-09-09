import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { addBacteria } from '../reducers/bacteriaReducer'
const BacteriumForm = () => {
    const [newBacterium, setNewBacterium] = useState('')
    const dispatch = useDispatch()
    const addBacterium = (event) => {
        event.preventDefault()
        dispatch(addBacteria(newBacterium))
        console.log("Adding new bacterium:", newBacterium)
        setNewBacterium('')
    }

    return (
        <div>
            <form onSubmit={addBacterium}>
                <input
                    value={newBacterium}
                    onChange={({ target }) => setNewBacterium(target.value)}
                />
                <button type="submit">Lisää</button>
            </form>
        </div>
    )
}

export default BacteriumForm