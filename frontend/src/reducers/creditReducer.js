import creditService from '../services/credit'
import { setNotification } from './notificationReducer'

const reducer = (state = [], action) => {
    switch (action.type) {
    case 'GET_CREDITS': {
        return action.data
    }
    case 'ZERO_CREDIT': {
        return action.data
    }
    default: return state
    }
}

export const getCredits = (token) => {
    return async dispatch => {
        const credits = await creditService.get(token)
        if (credits.error) {
            dispatch(setNotification({ message: credits.error, success: false }))
        } else {
            dispatch({
                type: 'GET_CREDITS',
                data: credits
            })
        }
    }
}

export const zeroCredit = () => {
    return async dispatch => {
        dispatch({
            type: 'ZERO_CREDIT',
            data: []
        })
    }
}

export default reducer