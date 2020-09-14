import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import BacteriumForm from './BacteriumForm'
import BacteriumListing from './BacteriumListing'
import { deleteBacterium, updateBacterium } from '../reducers/bacteriaReducer'

const BacteriaList = () => {
    const bacteria = useSelector(state => state.bacteria)
    const user = useSelector(state => state.user)
    const dispatch = useDispatch()
    const deleteBact = bacterium => {
        console.log('Removing ID', bacterium.id)
        dispatch(deleteBacterium(bacterium, user.token))
    }
    const updateBact = (newName, id) => {
        console.log('Updating ID', id)
        dispatch(updateBacterium(id, newName, user.token))
    }

    return (
        <div>
            <h2>Bakteerit</h2>
            {bacteria ?
                <ul>
                    {bacteria.map(bacterium =>
                        <BacteriumListing key={bacterium.id} bacterium={bacterium} deleteBact={deleteBact} updateBact={updateBact}></BacteriumListing>
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