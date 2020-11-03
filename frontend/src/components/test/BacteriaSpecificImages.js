import React from 'react'
import { Button, Form } from 'react-bootstrap'

const BacteriaSpecificImages = ({ controlId, setBacterium, bacteria, bacterium, setBacteriaImages, handleSpecificImg, bacteriaSpecificImages, bacteriaSpecificImage, addBacteriumSpecificImage, removeBacteriaSpecificImage, marginStyle }) => {
    console.log(bacteriaSpecificImages)
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
            <Form.Control
                as='select'
                style={marginStyle}
                value={bacterium}
                onClick={({ target }) => setBacterium(target.value)}
                onChange={({ target }) => setBacterium(target.value)}>
                <option>Valitse bakteeri</option>
                {bacteria.map(bact =>
                    <option key={bact.id} value={bact.name}>{bact.name}</option>
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