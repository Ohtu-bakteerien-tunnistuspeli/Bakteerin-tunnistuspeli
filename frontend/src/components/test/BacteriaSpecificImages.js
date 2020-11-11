import React from 'react'
import { Button, Form, Image } from 'react-bootstrap'

const BacteriaSpecificImages = ({ controlId, setBacterium, bacteria,
    bacterium, handleSpecificImg,
    bacteriaSpecificImages, bacteriaSpecificImage,
    addBacteriumSpecificImage, removeBacteriaSpecificImage,
    marginStyle, onChange, error, addedBacteriaImage }) => {

    const handleChange = (event) => {
        event.preventDefault()
        setBacterium(event.target.value)
        console.log(event.target.value)
        onChange('bacteriumName', event.target.value)
    }

    const handleAdd = (event) => {
        event.preventDefault()
        onChange('bacteriumName', '')
        addBacteriumSpecificImage()
    }

    return (
        <Form.Group controlId={controlId}>
            <Form.Label style={{ paddingTop: '40px' }}><h4>Bakteerikohtaiset kuvat</h4></Form.Label>
            {console.log('2', bacteriaSpecificImages)}
            <ul>
                {bacteriaSpecificImages.map((image, i) => {
                    return (
                        <li key={i}>{image.name ? image.name : image.bacterium.name} &ensp;&ensp;
                            {image.url ?
                                <Image src={`/${image.url}`} thumbnail width={100} /> :
                                <Image src={URL.createObjectURL(image)} width={100}></Image>
                            }
                            <Button
                                onClick={() => removeBacteriaSpecificImage(image)}
                                variant='danger'
                                size='sm'>
                                Poista kuva
                            </Button>
                        </li>
                    )
                }
                )}
            </ul>
            <Form.Label style={marginStyle}>Bakteeri</Form.Label>
            <Form.Control
                as='select'
                style={marginStyle}
                value={bacterium}
                isInvalid={error}
                onChange={(event) => handleChange(event)}>
                <option value='' disabled hidden>Valitse bakteeri</option>
                {bacteria.filter(bact => !addedBacteriaImage.includes(bact.name)).map(bact =>
                    <option key={bact.id} value={bact.name}>{bact.name}</option>
                )}
            </Form.Control>
            <Form.Control.Feedback type="invalid">
                {error}
            </Form.Control.Feedback>
            <Form.Control
                style={marginStyle}
                name='bacteriaSpecificImage'
                type='file'
                accept=".png, .jpg, .jpeg"
                value={bacteriaSpecificImage.image}
                onChange={handleSpecificImg}
            />
            <Button style={marginStyle} type='button' onClick={handleAdd}>Tallenna bakteerikohtainen kuva</Button>
        </Form.Group>
    )
}

export default BacteriaSpecificImages