import React from 'react'
import { Button, Form } from 'react-bootstrap'

const BacteriaSpecificImages = ({ controlId, setBacterium, bacteria, 
                                bacterium, setBacteriaImages, handleSpecificImg, 
                                bacteriaSpecificImages, bacteriaSpecificImage, 
                                addBacteriumSpecificImage, removeBacteriaSpecificImage, 
                                marginStyle, onChange, error, touched }) => {
                                  
    const handleChange = (event) => {
        event.preventDefault()
        setBacterium(event.target.value)
        onChange('bacteriumName', event.target.value)
    }
    
    
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
                isInvalid={error}
                onChange={(event) => handleChange(event) }>
                <option value='default' disabled hidden>Valitse bakteeri</option>
                {bacteria.map(bact =>
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
                value={bacteriaSpecificImage.image}
                onChange={handleSpecificImg}
            />
            <Button style={marginStyle} type='button' onClick={addBacteriumSpecificImage}>Tallenna bakteerikohtainen kuva</Button>
            <Button type='button' variant='warning' onClick={() => setBacteriaImages([])}>Tyhjennä bakteerikohtaisten kuvien lista</Button>
        </Form.Group>
    )
}

export default BacteriaSpecificImages