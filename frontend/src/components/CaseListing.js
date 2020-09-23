import React from 'react'
import { Button, ListGroup } from 'react-bootstrap'

const CaseListing = ({ c, admin, deleteCase, }) => {
    return (
        <ListGroup>
            <ListGroup.Item key={ c.id } >
                {admin ?
                    <div>
                        { c.name }
                        <div>
                            <Button variant='danger' style={{ float: 'right' }} id='deleteCase' onClick={ () => deleteCase(c) }>Poista</Button>
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