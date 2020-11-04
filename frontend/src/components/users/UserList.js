import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import UserListing from './UserListing'
import { Table } from 'react-bootstrap'
import { deleteUser, promoteUser, demoteUser } from '../../reducers/usersReducer'

const UserList = () => {
    const users = useSelector(state => state.users)?.sort((user1, user2) => user1.username.localeCompare(user2.username))
    const user = useSelector(state => state.user)
    const dispatch = useDispatch()
    const userDelete = (userToDelete) => {
        dispatch(deleteUser(userToDelete, user.token))
    }
    const promote = (userToPromote) => {
        dispatch(promoteUser(userToPromote.id, user.token))
    }
    const demote = (userToDemote) => {
        dispatch(demoteUser(userToDemote.id, user.token))
    }
    return (
        <div>
            <h2>Käyttäjät</h2>
            {users.length !== 0 ?
                <Table id='userTable'>
                    <thead>
                        <tr>
                            <th>Opiskelijanumero</th>
                            <th>Käyttäjänimi</th>
                            <th>Ylläpitäjä</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(listedUser =>
                            <UserListing 
                            key={listedUser.id} 
                            listedUser={listedUser}
                            userDelete={userDelete}
                            promote={promote}
                            demote={demote}
                            ></UserListing>
                        )}
                    </tbody>
                </Table>
                :
                <>
                    <div>Ei käyttäjiä</div>
                </>
            }
        </div>
    )
}

export default UserList