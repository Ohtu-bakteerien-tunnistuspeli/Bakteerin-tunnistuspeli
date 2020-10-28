import React from 'react'
import { Form } from 'react-bootstrap'

const SelectBacterium = ({ onChange, value, error, bacteria, touched}) => {
    const handleChange = event => {
        event.preventDefault()
        onChange('bacteriumId', event.target.value);
    }
    return (
        <Form.Control as='select'
            onChange={handleChange}
            isInvalid={error && touched}
            value={value}
        >
            <option value="">Valitse bakteeri</option>
            {bacteria.map(bacterium =>
                <option key={bacterium.id} value={bacterium.id}>{bacterium.name}</option>
            )}
        </Form.Control>
    )
}

export default SelectBacterium