import React from 'react'
import { Button, Form } from 'react-bootstrap'

const BacteriaSpecificImages = ({ controlId, setBacterium, bacteria, bacterium, setBacteriaImages, handleSpecificImg, bacteriaSpecificImages, bacteriaSpecificImage, addBacteriumSpecificImage, removeBacteriaSpecificImage, marginStyle }) => {
    return (
        <Form.Group controlId={controlId}>
            <Form.Label style={{ paddingTop:'40px' }}><h4>Bakteerikohtaiset kuvat</h4></Form.Label>
            <ul>
                {bacteriaSpecificImages.map((image, i) => {
                    return (
                        <li key={i}>{image.name ? image.name : image.bacterium.name} &ensp;&ensp;
                            <Button
                                onClick={ () => removeBacteriaSpecificImage(image) }
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
                onChange={({ target }) => setBacterium(target.value)}
                value={bacterium}
            >
                <option value='' disabled hidden>Valitse bakteeri</option>
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
            <Button style={marginStyle} type='button' onClick={addBacteriumSpecificImage}>Tallenna bakteerikohtainen kuva</Button>
            <Button type='button' variant='warning' onClick={() => setBacteriaImages([])}>Tyhjennä bakteerikohtaisten kuvien lista</Button>
        </Form.Group>
    )
}

export default BacteriaSpecificImages