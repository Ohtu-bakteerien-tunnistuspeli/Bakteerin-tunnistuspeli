import React , { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { Alert } from 'react-bootstrap'
import { setNotification } from '../../reducers/notificationReducer'

const Notification = () => {

    /* style parameters */
    const style = {
        position: 'absolute',
        'borderColor': 'green',
        'borderWidth': 'thin',
        top: '80px',
        right: '80px',
        width: '30%',
        minWidth: '180px',
        textAlign: 'center',
        zIndex: 99999
    }

    const styleFail = {
        position: 'absolute',
        'borderColor': '#9B870C',
        'borderWidth': 'thin',
        top: '80px',
        right: '80px',
        width: '30%',
        minWidth: '180px',
        textAlign: 'center',
        zIndex: 99999
    }
    /* style parameters end */

    /* onClose handler*/

    const onCloseHandler = () => {
        setShow(false)
        setNotification('')
    }

    /* onClose handler End */

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
            <Alert style={styleFail} show={show} variant="warning" className='message' onClose={() => onCloseHandler()} dismissible>{notification.message}</Alert>
        )
    }

    return (
        <Alert style={style} show={show} variant="success" className='message' onClose={() => onCloseHandler()} dismissible>{notification.message}</Alert>
    )
}

export default Notification