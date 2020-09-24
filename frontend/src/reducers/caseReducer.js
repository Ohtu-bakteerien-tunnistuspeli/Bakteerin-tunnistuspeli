import caseService from '../services/case'
import { setNotification } from '../reducers/notificationReducer'

const reducer = (state = null, action) => {
    switch (action.type) {
    case 'GET_CASES': {
        return action.data
    }
    default: return state
    }
}

export const getCases = (token) => {
    return async dispatch => {
        const cases = await caseService.get(token)
        if (cases.error) {
            dispatch(setNotification({ message: cases.error, success: false }))
        } else {
            dispatch({
                type: 'GET_CASES',
                data: cases
            })
        }
    }
}

export default reducer