import React from 'react'
import { ListGroup } from 'react-bootstrap'
import { Table } from 'react-bootstrap'

const ProfilePageUserInfo = ( { credit } ) => {

    return (
        <div>
            <Table>
                <tbody>
                    <tr key={credit.id}>
                        <td><b>käyttäjänimi</b></td>
                        <td> {credit.user.username} </td>
                    </tr>
                    <tr>
                        <td><b>opiskelijanumero</b></td>
                        <td> {credit.user.studentNumber} </td>
                    </tr>
                    <tr>
                        <td><b>sähköposti</b></td>
                        <td> {credit.user.email} </td>
                    </tr>
                    <tr>
                        <td><b>luokka</b></td>
                        <td> {credit.user.classGroup} </td>
                    </tr>
                </tbody>
            </Table>
            <h6>Suoritukset</h6>

            {credit.testCases.length !== 0 ?
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