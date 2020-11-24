import React from 'react'
import Sample from './Sample.js'
import { Form, Table } from 'react-bootstrap'
import { useSelector } from 'react-redux'

const Samples = ({ samples, deleteSample }) => {
    const library = useSelector(state => state.language)?.library?.frontend.case.components
    return (
        <Form.Group id='samples'>
            <Form.Label>{library.samples}</Form.Label><br></br>
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