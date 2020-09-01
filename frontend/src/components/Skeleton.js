import React, { useState } from 'react'
import skeletonService from '../services/skeleton'

const SkeletonComponent = () => {
    const [message, setMessage] = useState('')
    const buttonAction = async () => {
        if (message !== '') {
            setMessage('')
        } else {
            const receivedMessage = await skeletonService.get()
            setMessage(receivedMessage)
        }
    }
    return (
        <div>
            {message.greeting} <button onClick={buttonAction}>Get message</button>
        </div>
    )
}

export default SkeletonComponent