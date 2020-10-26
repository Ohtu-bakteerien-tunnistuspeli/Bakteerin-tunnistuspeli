import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import BacteriumForm from './BacteriumForm'
import BacteriumListing from './BacteriumListing'
import { deleteBacterium, updateBacterium } from '../../reducers/bacteriaReducer'

const BacteriaList = () => {
    const style = { margin: '10px', fontSize: '40px' }
    const bacteria = useSelector(state => state.bacteria)?.sort((bacterium1, bacterium2) => bacterium1.name.localeCompare(bacterium2.name))
    const user = useSelector(state => state.user)
    const dispatch = useDispatch()
    const deleteBact = bacterium => {
        dispatch(deleteBacterium(bacterium, user.token))
    }
    const updateBact = (newName, id) => {
        dispatch(updateBacterium(id, newName, user.token))
    }

    return (
        <div>
            <h2 style={style}>Bakteerit</h2>
            {bacteria.length !== 0 ?
                <ul>
                    {bacteria.map(bacterium =>
                        <BacteriumListing key={bacterium.id} bacterium={bacterium} deleteBact={deleteBact} updateBact={updateBact} isAdmin={user?.admin}></BacteriumListing>
                    )}
                </ul>
                :
                <div>Ei bakteereja</div>
            }
            {user?.admin ?
                <BacteriumForm></BacteriumForm>
                :
                <></>
            }

        </div>
    )
}

export default BacteriaList