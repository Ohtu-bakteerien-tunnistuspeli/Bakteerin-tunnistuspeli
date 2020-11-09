import React from 'react'
import { Button, Form, Image } from 'react-bootstrap'

const BacteriaSpecificImages = ({ controlId, setBacterium, bacteria, bacterium, setBacteriaImages, handleSpecificImg, bacteriaSpecificImages, bacteriaSpecificImage, addBacteriumSpecificImage, removeBacteriaSpecificImage, marginStyle }) => {
    return (
        <Form.Group controlId={controlId}>
            <Form.Label style={{ paddingTop: '40px' }}><h4>Bakteerikohtaiset kuvat</h4></Form.Label>
            <ul>
                {bacteriaSpecificImages.map((image, i) => {
                    return (
                        <li key={i}>{image.name ? image.name : image.bacterium.name} &ensp;&ensp;
                            {image.url?
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
            <Form.Control as='select'
                style={marginStyle}
                onChange={({ target }) => setBacterium(target.value)}
                value={bacterium}
            >
                <option value=''>Valitse bakteeri</option>
                {bacteria.map(bacterium =>
                    <option key={bacterium.id} value={bacterium.name}>{bacterium.name}</option>
                )}
            </Form.Control>
            <Form.Control
                style={marginStyle}
                name='bacteriaSpecificImage'
                type='file'
                value={bacteriaSpecificImage.image}
                onChange={handleSpecificImg}
            />
            <Button style={marginStyle} type='button'
                onClick={() => {

                    addBacteriumSpecificImage()}}>Lisää bakteerikohtainen kuva</Button>
            <Button type='button' variant='warning' onClick={() => setBacteriaImages([])}>Tyhjennä bakteerikohtaisten kuvien lista</Button>
        </Form.Group>
    )
}

export default BacteriaSpecificImages