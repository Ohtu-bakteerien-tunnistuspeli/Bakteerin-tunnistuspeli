import React, { useState, useEffect } from 'react'
import ConfirmWindow from './utility/ConfirmWindow.js'
import { useSelector, useDispatch } from 'react-redux'
import { deleteUser } from '../reducers/usersReducer'
import { logout } from '../reducers/userReducer'
import { useHistory } from 'react-router-dom'
import ProfilePageUserInfo from './ProfilePageUserInfo'
import { Table } from 'react-bootstrap'

const ProfilePage = () => {

    const user = useSelector(state => state.user)
    const credits = useSelector(state => state.credit)?.sort((credit1, credit2) => credit1.user.studentNumber.localeCompare(credit2.user.studentNumber))
    const [userInfo, setUserInfo] = useState(credits)
    const history = useHistory()
    const dispatch = useDispatch()

    useEffect(() => {
        setUserInfo(credits.filter(credit => credit.user.id === user.id))
        if(user.admin) {
            setUserInfo(user)
        }
    }, [user, credits])

    const userDelete = () => {
        dispatch(deleteUser(user, user.token))
        dispatch(logout(history))
    }

    return (
        <div>
            <h3>Oma profiilini</h3>
            {user.admin ?
                <div>
                    <Table>
                        <tbody>
                            <tr>
                                <td><b>käyttäjänimi</b> </td>
                                <td> {user.username}</td>
                            </tr>
                        </tbody>
                    </Table>
                </div>
                :
                <div>
                    {userInfo.map(credit =>
                        <ProfilePageUserInfo key={credit.id} credit={credit} user={user.admin} />
                    )}
                </div>
            }
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