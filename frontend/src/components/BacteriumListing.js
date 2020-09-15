import React, { useState } from 'react'

const BacteriumListing = ({ bacterium, deleteBact, updateBact, isAdmin }) => {
    const [isModified, setIsModified] = useState(false)
    const [newName, setNewName] = useState('')
    const modify = () => {
        if (newName) {
            updateBact(newName, bacterium.id)
            setIsModified(false)
            setNewName('')
        }
    }
    const stopModify = () => {
        setIsModified(false)
        setNewName('')
    }
    return (
        <li key={bacterium.id}>
            {bacterium.name}
            {isModified ?
                <>
                    <input value={newName} onChange={({ target }) => setNewName(target.value)} />
                    <button onClick={modify}>Muuta nimi</button>
                    <button onClick={stopModify}>Lopeta muokkaus</button>
                </>
                :
                <>
                    {isAdmin ?
                        <>
                            <button id='edit' onClick={() => setIsModified(true)}>Muokkaa</button>
                            <button id='delete' onClick={() => deleteBact(bacterium)}>Poista</button>
                        </>
                        :
                        <></>
                    }
                </>
            }
        </li>
    )
}

export default BacteriumListing