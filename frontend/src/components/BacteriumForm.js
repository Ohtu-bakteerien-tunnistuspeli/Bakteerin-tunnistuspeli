import React, { useState } from 'react'

const BacteriumForm = () => {
    const [newBacterium, setNewBacterium] = useState('')

    const addBacterium = (event) => {
        event.preventDefault()
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