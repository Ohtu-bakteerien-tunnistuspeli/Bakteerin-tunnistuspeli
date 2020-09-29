import React from 'react'
import { Button, ListGroup } from 'react-bootstrap'

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
