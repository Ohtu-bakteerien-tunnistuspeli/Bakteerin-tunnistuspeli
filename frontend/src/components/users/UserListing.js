import React from 'react'
import ConfirmWindow from '../utility/ConfirmWindow'

const UserListing = ({ listedUser, userDelete, promote, demote }) => {
    return (
        <tr>
            <td>{listedUser.studentNumber ? listedUser.studentNumber : ''}</td>
            <td>{listedUser.username}</td>
            <td>{listedUser.admin ? <i className='fas fa-check'></i> : <></>}</td>
            <td>
                <div style={{ float: 'right' }}>
                    {listedUser.admin ?
                        <ConfirmWindow
                            listedUser={listedUser}
                            buttonId='demoteUser'
                            modalOpenButtonText='Alenna'
                            modalOpenButtonVariant='primary'
                            modalHeader={`Käyttäjän ${listedUser.username} alentamisen varmennus`}
                            warningText='Kirjoita käyttäjän nimi ja paina nappia alentaaksesi käyttäjä'
                            functionToExecute={demote}
                            executeButtonText='Alenna käyttäjä'
                            executeButtonVariant='primary'
                        />
                        :
                        <ConfirmWindow
                            listedUser={listedUser}
                            buttonId='promoteUser'
                            modalOpenButtonText='Ylennä'
                            modalOpenButtonVariant='primary'
                            modalHeader={`Käyttäjän ${listedUser.username} ylentämisen varmennus`}
                            warningText='Kirjoita käyttäjän nimi ja paina nappia ylentääksesi käyttäjä'
                            functionToExecute={promote}
                            executeButtonText='Ylennä käyttäjä'
                            executeButtonVariant='primary'
                        />
                    }
                    <ConfirmWindow
                        listedUser={listedUser}
                        buttonId='deleteUser'
                        modalOpenButtonText='Poista'
                        modalOpenButtonVariant='danger'
                        modalHeader={`Käyttäjän ${listedUser.username} poistamisen varmennus`}
                        warningText='Kirjoita käyttäjän nimi ja paina nappia poistaaksesi käyttäjä'
                        functionToExecute={userDelete}
                        executeButtonText='Poista käyttäjä'
                        executeButtonVariant='danger'
                    />
                </div>

            </td>
        </tr>
    )
}

export default UserListing