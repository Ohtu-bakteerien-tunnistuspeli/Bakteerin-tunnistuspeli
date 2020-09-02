import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { zeroMessage, getMessage } from '../reducers/skeletonReducer'

const SkeletonComponent = () => {
    const dispatch = useDispatch()
    const message = useSelector(state => state.message)
    const buttonAction = async () => {
        if (message !== '') {
            dispatch(zeroMessage())
        } else {
            dispatch(getMessage())
        }
    }
    return (
        <div>
            {message.greeting} <button onClick={buttonAction}>Get message</button>
        </div>
    )
}

export default SkeletonComponent