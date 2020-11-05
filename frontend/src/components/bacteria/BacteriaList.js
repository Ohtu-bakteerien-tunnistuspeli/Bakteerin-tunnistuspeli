import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import BacteriumForm from './BacteriumForm'
import BacteriumListing from './BacteriumListing'
import { deleteBacterium, updateBacterium } from '../../reducers/bacteriaReducer'
import { Table } from 'react-bootstrap'

const BacteriaList = () => {
    const bacteria = useSelector(state => state.bacteria)?.sort((bacterium1, bacterium2) => bacterium1.name.localeCompare(bacterium2.name))
    const user = useSelector(state => state.user)
    const dispatch = useDispatch()
    const deleteBact = bacterium => {
        dispatch(deleteBacterium(bacterium, user.token))
    }
    const updateBact = (newName, id, setIsModified, setNewName) => {
        dispatch(updateBacterium(id, newName, user.token, setIsModified, setNewName))
    }

    return (
        <div>
            <h2>Bakteerit</h2>
            {bacteria.length !== 0 ?
                <Table id='bacteriumTable' borderless hover>
                    <thead>
                        <tr>
                            <th>Nimi</th>
                            <th>
                                {user?.admin ?
                                    <BacteriumForm></BacteriumForm>
                                    :
                                    <></>
                                }
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {bacteria.map(bacterium =>
                            <BacteriumListing key={bacterium.id} bacterium={bacterium} deleteBact={deleteBact} updateBact={updateBact} isAdmin={user?.admin}></BacteriumListing>
                        )}
                    </tbody>
                </Table>
                :
                <>
                    {user?.admin ?
                        <BacteriumForm></BacteriumForm>
                        :
                        <></>
                    }
                    <div>Ei bakteereja</div>
                </>

            }
        </div>
    )
}

export default BacteriaList