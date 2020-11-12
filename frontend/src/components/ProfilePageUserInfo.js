import React from 'react'
import { ListGroup } from 'react-bootstrap'
import { Table } from 'react-bootstrap'

const ProfilePageUserInfo = ({ credit, user }) => {
    return (
        <div>
            <Table>
                <tbody>
                    <tr key={user.id}>
                        <td><b>Käyttäjänimi:</b></td>
                        <td> {user.username} </td>
                    </tr>
                    <tr>
                        <td><b>Opiskelijanumero:</b></td>
                        <td> {user.studentNumber} </td>
                    </tr>
                    <tr>
                        <td><b>Sähköposti:</b></td>
                        <td> {user.email} </td>
                    </tr>
                    <tr>
                        <td><b>Vuosikurssi:</b></td>
                        <td> {user.classGroup} </td>
                    </tr>
                </tbody>
            </Table>
            <h6>Suoritukset</h6>
            {credit && credit.testCases && credit.testCases.length > 0 ?
                <>
                    {credit.testCases.map(completedCase =>
                        <ListGroup variant='flush' key={completedCase}>
                            <ListGroup.Item>{completedCase}</ListGroup.Item>
                        </ListGroup>
                    )}
                </>
                :
                <p>Ei suorituksia</p>
            }
        </div>
    )
}

export default ProfilePageUserInfo