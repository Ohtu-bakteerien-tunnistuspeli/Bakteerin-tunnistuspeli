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
    case 'DELETE_TEST': {
        return state.filter(test => test.id !== action.id)
    }
    case 'UPDATE_TEST': {
        return state.map(test => test.id !== action.data.id)
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

export const deleteTest = (id, token) => {
    return async dispatch => {
        const response = await testService.delete(id, token)
        if (response.status !== 204) {
            dispatch(setNotification({ message: response.error, success: false }))
        } else {
            dispatch(setNotification({ message: 'Test successfully deleted', success: true }))
            dispatch({
                type: 'DELETE_TEST',
                data: id
            })
        }
    }
}

export const updateTest = (id, name, type, contImg, photoPos, photoNeg, token) => {
    return async dispatch => {
        const test = await testService.update(id, name, type, contImg, photoPos, photoNeg, token)
        if (test.error) {
            dispatch(setNotification({ message: test.error.substring(test.error.indexOf('name: ') + 6), success: false }))
        } else {
            dispatch({
                type: 'UPDATE_TEST',
                data: test
            })
        }
    }
}

export default reducer