import React from 'react'
import { Button, ListGroup } from 'react-bootstrap'
import CaseEditForm from './CaseEditForm'

const CaseListing = ({ c, admin, deleteCase }) => {
   /* let completionUrl
    if(c.completionImage) {
        completionUrl = btoa(String.fromCharCode.apply(null, c.completionImage.data.data))
    }*/
    return (
        <ListGroup>
            <ListGroup.Item key={ c.id } >
                {admin ?
                    <div>
                        { c.name } {/*c.completionImage ? <img src={`data:${c.completionImage.contentType};base64,${completionUrl}`} alt='control'/> : <></>*/}
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
