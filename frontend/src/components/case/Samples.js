import React from 'react'
import Sample from './Sample.js'
import { Form, Table } from 'react-bootstrap'

const Samples = ({ samples, deleteSample }) => {
    return (
        <Form.Group id='samples'>
            <Form.Label>Näytevaihtoehdot: </Form.Label><br></br>
            <Table>
                <tbody>
                    {samples.map(s =>
                        <Sample key={s.description}
                            sample={s}
                            sampleChange={deleteSample} >
                        </Sample>
                    )}
                </tbody>
            </Table>
        </Form.Group>
    )
}

export default Samples