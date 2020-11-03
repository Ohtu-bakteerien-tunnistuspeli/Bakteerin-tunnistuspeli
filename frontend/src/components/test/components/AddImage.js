import React from 'react'
import { Form } from 'react-bootstrap'

const AddImage = ({ title, name, value, setImage, setAdded }) => {
    return (
        <Form.Group style={{ paddingTop: '20px' }} controlId={name}>
            <Form.Label>{title}</Form.Label>
            <Form.Control
                name={name}
                type='file'
                value={value}
                onChange={({ target }) => {
                    setImage(target.files[0])
                    setAdded(true)
                }}
                onClick={(event) => event.target.value = ''}
            />
        </Form.Group>
    )
}

export default AddImage