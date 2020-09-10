import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import BacteriumForm from './BacteriumForm'
import { deleteBacterium } from '../reducers/bacteriaReducer'

const BacteriaList = () => {
    const bacteria = useSelector(state => state.bacteria)
    const user = useSelector(state => state.user)
    const dispatch = useDispatch()
    const deleteBact = bacterium => {
        console.log("Removing ID", bacterium.id)
        dispatch(deleteBacterium(bacterium, user.token))
    }

    return (
        <div>
            <h2>Bakteerit</h2>
            {bacteria ?
                <ul>
                    {bacteria.map(bacterium =>
                        <li key={bacterium.id}>
                            {bacterium.name}
                            <button onClick={() => deleteBact(bacterium)}>Poista</button>
                            <button onClick='tee jotain'>Muokkaa</button>
                        </li>
                    )}
                </ul>
                :
                <div>Bakteereja haetaan</div>
            }
            <BacteriumForm></BacteriumForm>
        </div>
    )
}

export default BacteriaList