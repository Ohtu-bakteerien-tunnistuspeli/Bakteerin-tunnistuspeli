import React from 'react'
import { Button, Form } from 'react-bootstrap'
import { useSelector } from 'react-redux'

const AddSample = ({ sample, setSample, addSample, error, onChange, touched, handleBlur }) => {
    const library = useSelector(state => state.language)?.library?.frontend.case.components
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
                onBlur={handleBlur}
            />
            <Form.Control.Feedback type='invalid' hidden={!touched}>
                {error}
            </Form.Control.Feedback>
            <Form.Check
                type='checkbox'
                id='isRightAnswer'
                label={library.sampleRightAnswer}
                checked={sample.rightAnswer}
                onChange={() => setSample({ ...sample, rightAnswer: !sample.rightAnswer })} />
            <Button type='button' id='addSample' onClick={() => {
                addSample(sample.description, sample.rightAnswer, onChange)}}>+</Button>
        </Form.Group>
    )
}

export default AddSample