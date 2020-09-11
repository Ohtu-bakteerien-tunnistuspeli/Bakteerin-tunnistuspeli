import React from 'react'
import { useSelector } from 'react-redux'
import { Alert } from 'react-bootstrap'

const Notification = ( ) => {
    const notification = useSelector(state => state.notification)

    if(notification === '') {
        return (
            <></>
        )
    }

    return (
    <Alert variant="success" className='message'>{notification.message}</Alert>
    )
}

export default Notification