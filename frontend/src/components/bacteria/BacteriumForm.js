import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { addBacteria } from '../../reducers/bacteriaReducer'
import { Button, Form } from 'react-bootstrap'

const BacteriumForm = () => {
    const [newBacterium, setNewBacterium] = useState('')
    const user = useSelector(state => state.user)
    const dispatch = useDispatch()
    const style = { margin: '10px' }
    const addBacterium = (event) => {
        event.preventDefault()
        dispatch(addBacteria(newBacterium, user.token))
        setNewBacterium('')
    }

    return (
        <div style={{ float: 'right' }}>
            <Form onSubmit={addBacterium}>
                <input
                    id="newBacterium"
                    value={newBacterium}
                    onChange={({ target }) => setNewBacterium(target.value)}
                    style={style}
                />
                <Button variant="primary" type="submit">Lisää bakteeri</Button>
            </Form>
        </div>
    )
}

export default BacteriumForm