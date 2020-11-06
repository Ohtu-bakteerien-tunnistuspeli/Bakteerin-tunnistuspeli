import React from 'react'
import ConfirmWindow from './utility/ConfirmWindow.js'
import { useSelector, useDispatch } from 'react-redux'
import { deleteUser } from '../reducers/usersReducer'
import { logout } from '../reducers/userReducer'
import { useHistory } from 'react-router-dom'

const ProfilePage = () => {
    const user = useSelector(state => state.user)
    const history = useHistory()
    const dispatch = useDispatch()
    const userDelete = () => {
        dispatch(deleteUser(user, user.token))
        dispatch(logout(history))
    }
    return (
        <div>
            <h3>Oma profiilini</h3>
            <ConfirmWindow
                listedUser={user}
                buttonId='deleteUser'
                modalOpenButtonText='Poista käyttäjätunnus'
                modalOpenButtonVariant='danger'
                modalHeader={`Käyttäjän ${user.username} poistamisen varmennus`}
                warningText='Olet poistamassa käyttäjätunnustasi.
                Et voi palauttaa käyttäjätunnustasi, kun olet sen poistanut. 
                Jos olet varma, että haluat poistaa käyttäjätunnksesi, niin
                kirjoita käyttäjänimesi ja paina nappia poistaaksesi profiilisi.'
                functionToExecute={userDelete}
                executeButtonText='Poista käyttäjä'
                executeButtonVariant='danger'
            />
        </div>
    )
}

export default ProfilePage