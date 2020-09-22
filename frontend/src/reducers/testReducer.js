import testService from '../services/test'
import { setNotification } from '../reducers/notificationReducer'

const reducer = (state = null, action) => {
    switch (action.type) {
    case 'GET_TEST': {
        return action.data
    }
    case 'ADD_TEST': {
        return [...state, action.data]
    }
    default: return state
    }
}


export const getTests = (token) => {
    return async dispatch => {
        const test = await testService.get(token)
        if (test.error) {
            dispatch(setNotification({ message: test.error, success: false }))
        } else {
            dispatch({
                type: 'GET_TEST',
                data: test
            })
        }
    }
}

export const addTest = (name, type, contImg, posImg, negImg, token) => {
    return async dispatch => {
        const test = await testService.add(name, type, contImg, posImg, negImg, token)
        if (test.error) {
            dispatch(setNotification({ message: test.error.substring(test.error.indexOf('name: ') + 6), success: false }))
        } else {
            dispatch({
                type: 'ADD_TEST',
                data: test
            })
        }
    }
}

export default reducer