import React from 'react'
import { Image } from 'react-bootstrap'

const ShowPreviewImage = ({ imgPreview }) =>
    imgPreview ?
        <Image src={imgPreview} thumbnail width={100}></Image>
        : null

export default ShowPreviewImage