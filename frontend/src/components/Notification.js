import React from 'react'
import { useSelector } from 'react-redux'

const Notification = ( {message} ) => {
    if(message === null) {
        return null
    }

    return (
        <div className="alert">
            {message}
        </div>
    )
}

export default Notification