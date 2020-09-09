import React from 'react'
import { useSelector } from 'react-redux'
import BacteriumForm from './BacteriumForm'

const BacteriaList = () => {
    const bacteria = useSelector(state => state.bacteria)
    return (
        <div>
            <h2>Bakteerit</h2>
            {bacteria ?
                <li>
                    {bacteria.map(bacterium =>
                        <ul key={bacterium.id}>{bacterium.name}</ul>
                    )}
                </li>
                :
                <div>Bakteereja haetaan</div>
            }
            <BacteriumForm></BacteriumForm>
        </div>
    )
}

export default BacteriaList