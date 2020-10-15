import React from 'react'
import { Button, ListGroup } from 'react-bootstrap'
import CaseEditForm from './CaseEditForm'
import ModalImage from '../ModalImage'

const CaseListing = ({ c, admin, deleteCase }) => {
    /* let completionUrl
    if(c.completionImage) {
        completionUrl = btoa(String.fromCharCode.apply(null, c.completionImage.data.data))
    }*/
    console.log(c)
    return (
        <ListGroup>
            <ListGroup.Item key={c.id} >
                {admin ?
                    <div>
                        { console.log(c.completionImage)}
                        {c.name} {c.completionImage ? <ModalImage imageUrl={c.completionImage.url} width={'10%'} height={'10%'} /> : <></>}
                        <div>
                            <Button variant='danger' style={{ float: 'right' }} id='deleteCase' onClick={() => deleteCase(c)}>Poista</Button>
                            <CaseEditForm caseToEdit={c}></CaseEditForm>
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
