import React from 'react'
import ConfirmWindow from './utility/ConfirmWindow.js'
import { useSelector, useDispatch } from 'react-redux'
import { deleteUser } from '../reducers/usersReducer'
import { logout } from '../reducers/userReducer'
import { useHistory } from 'react-router-dom'
import ProfilePageUserInfo from './ProfilePageUserInfo'
import UserinfoForm from './user/UserinfoForm'

const ProfilePage = () => {
    const user = useSelector(state => state.user)
    const credits = useSelector(state => state.credit)
    const history = useHistory()
    const dispatch = useDispatch()
    const userDelete = () => {
        dispatch(deleteUser(user, user.token))
        dispatch(logout(history))
    }

    return (
        <div>
            <h3>Oma profiilini</h3>
            <div>
                <ProfilePageUserInfo credit={credits.filter(credit => credit.user.id === user.id).length > 0 ? credits.filter(credit => credit.user.id === user.id)[0] : null} user={user} />
            </div>
            <ConfirmWindow
                listedUser={user}
                buttonId='deleteUser'
                modalOpenButtonText='Poista käyttäjätunnus'
                modalOpenButtonVariant='danger'
                modalHeader={`Käyttäjän ${user.username} poistamisen varmennus`}
                warningText='Olet poistamassa käyttäjätunnustasi.
                Et voi palauttaa käyttäjätunnustasi, kun olet sen poistanut.
                Käyttäjätunnuksen poistaminen poistaa myös suoritukset.
                Jos olet varma, että haluat poistaa käyttäjätunnksesi, niin
                kirjoita käyttäjänimesi ja paina nappia poistaaksesi profiilisi.'
                functionToExecute={userDelete}
                executeButtonText='Poista käyttäjä'
                executeButtonVariant='danger'
            />
            <div>
                <UserinfoForm user={user}></UserinfoForm>
            </div>
        </div>
    )
}

export default ProfilePage