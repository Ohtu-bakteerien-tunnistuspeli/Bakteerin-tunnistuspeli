import React from 'react'
import { Form } from 'react-bootstrap'
import ShowPreviewImage from './ShowPreviewImage.js'

const AddImage = ({ title, name, value, setImage, setAdded, imgPreview, setImgPreview }) => {
    return (
        <Form.Group style={{ paddingTop: '20px' }} controlId={name}>
            <Form.Label>{title}</Form.Label>
            <ShowPreviewImage imgPreview ={imgPreview}></ShowPreviewImage>
            <Form.Control
                name={name}
                type='file'
                accept=".png, .jpg, .jpeg"
                value={value}
                onChange={({ target }) => {
                    setImgPreview(URL.createObjectURL(target.files[0]))
                    setImage(target.files[0])
                    setAdded(true)
                }}
            />
        </Form.Group>
    )
}

export default AddImage