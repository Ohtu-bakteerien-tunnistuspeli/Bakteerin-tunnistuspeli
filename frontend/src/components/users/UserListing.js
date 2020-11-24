import React from 'react'
import ConfirmWindow from '../utility/ConfirmWindow'
import { useSelector } from 'react-redux'

const UserListing = ({ listedUser, userDelete, promote, demote }) => {
    const library = useSelector(state => state.language)?.library?.frontend.users.listing
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
                            modalOpenButtonText={library.demote.button}
                            modalOpenButtonVariant='primary'
                            modalHeader={`${library.demote.modalHeaderStart}${listedUser.username}${library.demote.modalHeaderEnd}`}
                            warningText={library.demote.warning}
                            functionToExecute={demote}
                            executeButtonText={library.demote.executeButton}
                            executeButtonVariant='primary'
                        />
                        :
                        <ConfirmWindow
                            listedUser={listedUser}
                            buttonId='promoteUser'
                            modalOpenButtonText={library.promote.button}
                            modalOpenButtonVariant='primary'
                            modalHeader={`${library.promote.modalHeaderStart}${listedUser.username}${library.promote.modalHeaderEnd}`}
                            warningText={library.promote.warning}
                            functionToExecute={promote}
                            executeButtonText={library.promote.executeButton}
                            executeButtonVariant='primary'
                        />
                    }
                    <ConfirmWindow
                        listedUser={listedUser}
                        buttonId='deleteUser'
                        modalOpenButtonText={library.delete.button}
                        modalOpenButtonVariant='danger'
                        modalHeader={`${library.delete.modalHeaderStart}${listedUser.username}${library.delete.modalHeaderEnd}`}
                        warningText={library.delete.warning}
                        functionToExecute={userDelete}
                        executeButtonText={library.delete.executeButton}
                        executeButtonVariant='danger'
                    />
                </div>

            </td>
        </tr>
    )
}

export default UserListing