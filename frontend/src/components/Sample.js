import React from 'react'
import { Form } from 'react-bootstrap'



const Sample = ({ sample, sampleChange }) => {
    return (
 <div>
            <Form.Label>{sample.description} </ Form.Label>
            {sample.rightAnswer ?
                <>
                    <Form.Label>Oikea vastaus </ Form.Label>
                </>
                :
                <>
                    <Form.Label>Väärä vastaus </ Form.Label>
                </>
            }
            <button onClick={(event) => {
                event.preventDefault()
                sampleChange(sample)
            }}>Poista</button>
        </div>
    )
}

export default Sample
