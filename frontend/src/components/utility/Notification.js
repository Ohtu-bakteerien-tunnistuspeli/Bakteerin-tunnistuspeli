import React , { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { Alert } from 'react-bootstrap'

const Notification = () => {

    /* style parameters */
    const style = {
        position: 'absolute',
        'border-color': 'green',
        'border-width': 'thin',
        top: '10%',
        width: '60%'
    }

    const styleFail = {
        position: 'absolute',
        'border-color': '#9B870C',
        'border-width': 'thin',
        top: '10%',
        width: '60%'
    }
    /* style parameters end */

    const notification = useSelector(state => state.notification)
    const [show, setShow] = useState(true)

    useEffect(() => {
        setShow(notification.show)
    }, [notification.show])

    if(notification === '') {
        return (
            <></>
        )
    }

    if(!notification.success) {
        return (
            <Alert style={styleFail} show={show} variant="warning" className='message' onClose={() => setShow(false)} dismissible>{notification.message}</Alert>
        )
    }

    return (
        <Alert style={style} show={show} variant="success" className='message' onClose={() => setShow(false)} dismissible>{notification.message}</Alert>
    )
}

export default Notification