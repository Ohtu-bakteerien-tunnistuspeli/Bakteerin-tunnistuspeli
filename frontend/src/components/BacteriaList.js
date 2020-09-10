import React from 'react'
import { useSelector } from 'react-redux'
import BacteriumForm from './BacteriumForm'

const BacteriaList = () => {
    const bacteria = useSelector(state => state.bacteria)


    return (
        <div>
            <h2>Bakteerit</h2>
            {bacteria ?
                <ul>
                    {bacteria.map(bacterium =>
                        <li key={bacterium.id}>{bacterium.name} <button onClick='tee jotain'>Muokkaa</button></li>
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