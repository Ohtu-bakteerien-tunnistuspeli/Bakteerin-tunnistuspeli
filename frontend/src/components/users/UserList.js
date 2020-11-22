import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import UserListing from './UserListing'
import { Table } from 'react-bootstrap'
import { deleteUser, promoteUser, demoteUser } from '../../reducers/usersReducer'

const UserList = () => {
    const users = useSelector(state => state.users)?.sort((user1, user2) => user1.username.localeCompare(user2.username))
    const user = useSelector(state => state.user)
    const [usersToShow, setUsersToShow] = useState(users)
    const [filterByStudentNumber, setFilterByStudentNumber] = useState('')
    const [filterByUsername, setFilterByUsername] = useState('')
    // const [filterByAdmin, setFilterByAdmin] = useState('')
    const dispatch = useDispatch()

    useEffect(() => {
        if(filterByStudentNumber === '' && filterByUsername === '') {
            setUsersToShow(users)
        } else {
            if(filterByStudentNumber === '') {
                setUsersToShow(users.filter(user => user.username && user.username.startsWith(filterByUsername)))
            } else if(filterByUsername === '') {
                setUsersToShow(users.filter(user => user.studentNumber && user.studentNumber.startsWith(filterByStudentNumber)))
            } else {
                setUsersToShow(users.filter(user => user.username && user.username.startsWith(filterByUsername) && user.studentNumber && user.studentNumber.startsWith(filterByStudentNumber)))
            }
        }
    }, [filterByUsername, filterByStudentNumber, users])

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
            Filtteröi Opiskelijanumerolla <input id='studentNumberFilter' type='text' value={filterByStudentNumber} onChange={({ target }) => setFilterByStudentNumber(target.value)}></input>&nbsp;
            Filtteröi käyttäjänimellä <input id='usernameFilter' type='text' value={filterByUsername} onChange={({ target }) => setFilterByUsername(target.value)}></input>&nbsp;
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
                        {usersToShow.map(listedUser =>
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