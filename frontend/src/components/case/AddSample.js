import React from 'react'
import { Button, Form } from 'react-bootstrap'


const AddSample = ({ sample, setSample, addSample, error, onChange }) => {
    const handleChange = event => {
        event.preventDefault()
        setSample({ ...sample, description: event.target.value })
        onChange('sample', event.target.value)
    }
    return (
        <Form.Group>
            <Form.Control
                id='sample'
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
<<<<<<< HEAD
                addSample(sample.description, sample.rightAnswer, onChange)}}>+</Button>
=======
                addSample(sample.description, sample.rightAnswer)
                onChange('sample','')}
                }>+</Button>
>>>>>>> dc8ce4e560b7b68e793fee029843665b90f69099
        </Form.Group>
    )
}

export default AddSample