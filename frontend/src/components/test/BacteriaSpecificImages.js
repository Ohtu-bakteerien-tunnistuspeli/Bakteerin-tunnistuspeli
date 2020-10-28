import React from 'react'
import { Button, Form } from 'react-bootstrap'

const BacteriaSpecificImages = ({controlId, setBacterium, bacteria, bacterium, setBacteriaImages, handleSpecificImg, bacteriaSpecificImages, bacteriaSpecificImage, addBacteriumSpecificImage, marginStyle}) => {
    return (
        <Form.Group controlId={controlId}>
            <Form.Label>Bakteerikohtaiset tulokset</Form.Label>
            <ul>
                {bacteriaSpecificImages.map((image, i) =>
                    <li key={i}>{image.name}</li>
                )}
            </ul>
            <Form.Label style={marginStyle}>Bakteeri</Form.Label>
            <Form.Control
                as='select'
                style={marginStyle}
                value={bacterium}
                onClick={({ target }) => setBacterium(target.value)}
                onChange={({ target }) => setBacterium(target.value)}>
                {bacteria.map(bact =>
                    <option key={bact.id} value={bact.name}>{bact.name}</option>
                )}
            </Form.Control>
            <Form.Label style={marginStyle}>Bakteerikohtaiset Kuvat </Form.Label>
            <Form.Control
                style={marginStyle}
                name='bacteriaSpecificImage'
                type='file'
                value={bacteriaSpecificImage.image}
                onChange={handleSpecificImg}
            />
            <Button style={marginStyle} type='button' onClick={addBacteriumSpecificImage}>Lisää bakteerikohtainen kuva</Button>
            <Button type='button' variant='warning' onClick={() => setBacteriaImages([])}>Tyhjennä bakteerikohtaisten kuvien lista</Button>
        </Form.Group>
    )
}

export default BacteriaSpecificImages