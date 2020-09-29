import React from 'react'
import { Button, Form, ListGroup } from 'react-bootstrap'



const Sample = ({ sample, sampleChange, sampleAnswerChange }) => {
    return (
       <div>
           <Form.Control onChange={sampleChange} defaultValue={sample.description} />
        {sample.rightAnswer ?
        <>
        <Form.Check onChange={sampleAnswerChange} type="checkbox" label="Oikea vastaus" checked />
        </>
        :
        <>
        <Form.Check onChange={sampleAnswerChange} type="checkbox" label="Oikea vastaus"/>
        </>
        }
           
       </div>
    )
}

export default Sample
