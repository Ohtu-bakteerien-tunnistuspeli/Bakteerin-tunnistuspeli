import React from 'react'
import { Button, ListGroup } from 'react-bootstrap'

const CaseListing = ({ case, admin, deleteCase, }) => {
    return (
        <ListGroup>
            <ListGroup.Item key={ case.id } >
                {admin ?
                    <div>
                        { case.name }
                        <div>
                        <Button variant='danger' style={{ float: 'right' }} id='deleteCase' onClick={ () => deleteCase(case) }>Poista</Button>
                        <Button variant='primary' style={{ float: 'right' }} id='editCase'>Muokkaa</Button>
                        </div>
                    </div>
                        :
                    <></>
                }
            </ListGroup.Item>
        </ListGroup>
    )
}

export default CaseListing