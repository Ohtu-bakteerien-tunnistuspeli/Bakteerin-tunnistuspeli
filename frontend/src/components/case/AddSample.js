import React from 'react'
import { Button, Form } from 'react-bootstrap'


const AddSample = ({ sample, setSample, addSample, error, onChange }) => {
    const handleChange = event => {
        event.preventDefault()
        setSample({ ...sample, description: event.target.value })
        onChange('sample', event.target.value);
    }
    return (
        <Form.Group>
            <Form.Control
                value={sample.description}
                onChange={handleChange}
                isInvalid={error}
            />
            <Form.Control.Feedback type="invalid">
                {error}
            </Form.Control.Feedback>
            <Form.Check
                type='checkbox'
                id='isRightAnswer'
                label='Oikea vastaus'
                checked={sample.rightAnswer}
                onChange={() => setSample({ ...sample, rightAnswer: !sample.rightAnswer })} />
            <Button type='button' id='addSample' onClick={() => {
                addSample(sample.description, sample.rightAnswer)}}>+</Button>
        </Form.Group>
    )
}

export default AddSample