import React from 'react'
import { Button } from 'react-bootstrap'

const Sample = ({ sample, sampleChange }) => {
    return (
         <tr>
            <td>{sample.description}</td>
            <td>{sample.rightAnswer ? <p>Oikea vastaus</p> : <p>Väärä vastaus</p>}</td>
            <td><Button variant='danger' onClick={(event) => {
                event.preventDefault()
                sampleChange(sample)
            }}>Poista</Button></td>
        </tr>

    )
}

export default Sample
