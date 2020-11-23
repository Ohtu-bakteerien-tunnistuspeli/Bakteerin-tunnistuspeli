import React from 'react'
import { Form } from 'react-bootstrap'
import { INITIAL_STATE } from '../utility.js'
import ShowPreviewImage from './ShowPreviewImage.js'

const AddImage = ({ title, name, value, setImage, imgPreview, setImgPreview }) => {

    const handleImageAdd = (target) => {
        if (target.files[0]) {
            setImgPreview(URL.createObjectURL(target.files[0]))
            setImage(target.files[0])
        } else {
            setImgPreview('')
            setImage(INITIAL_STATE)
        }
    }

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
                    handleImageAdd(target)
                }}
            />
        </Form.Group>
    )
}

export default AddImage