import React from 'react'
import { Button, ListGroup } from 'react-bootstrap'

const CaseListing = ({ case, admin }) => {
    return (
        <ListGroup>
            <ListGroup.Item key={ case.id }>
                {admin ?
                    <div>
                        { case.name } {  }
                        <Button variant='danger' style={{ float: 'right' }} id='delete' onClick={() => deleteBact(bacterium)}>Poista</Button>
                        <Button variant='primary' style={{ float: 'right' }} id='edit' onClick={() => setIsModified(true)}>Muokkaa</Button>
                    </div>
                        :
                    <></>
                }
            </ListGroup.Item>
        </ListGroup>
    )
}

export default BacteriumListing