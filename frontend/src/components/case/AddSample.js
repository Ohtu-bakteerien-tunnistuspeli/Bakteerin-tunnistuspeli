import React from 'react'
import { Button, Form } from 'react-bootstrap'


const AddSample = ({ sample, setSample, addSample }) => {
    return (<Form.Group>
        <Form.Control
            controlId='samples'
            value={sample.description}
            onChange={(event) => setSample({ ...sample, description: event.target.value })}
        />
        <Form.Check
            type='checkbox'
            id='isRightAnswer'
            label='Oikea vastaus'
            checked={sample.rightAnswer}
            onChange={() => setSample({ ...sample, rightAnswer: !sample.rightAnswer })} />
        <Button type='button' id='addSample' onClick={() => addSample(sample.description, sample.rightAnswer)}>+</Button>
    </Form.Group>
    )
}

export default AddSample