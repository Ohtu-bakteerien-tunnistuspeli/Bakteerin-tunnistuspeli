import React from 'react'
import { Button, ListGroup } from 'react-bootstrap'
import CaseEditForm from './CaseEditForm'

const CaseListing = ({ c, admin, deleteCase }) => {
    return (
        <ListGroup>
            <ListGroup.Item key={ c.id } >
                {admin ?
                    <div>
                        { c.name }
                        <div>
                            <Button variant='danger' style={{ float: 'right' }} id='deleteCase' onClick={ () => deleteCase(c) }>Poista</Button>
                            <CaseEditForm c = { c }></CaseEditForm>
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
