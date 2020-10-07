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
        console.log(action.data)
        return state.filter(test => test.id !== action.data)
    }
    case 'UPDATE_TEST': {
        return state.map(test => test.id === action.data.id ? test = action.data : test)
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

export const addTest = (name, type, contImg, posImg, negImg, bacteriaSpesif, token, resetTestForm) => {
    return async dispatch => {
        const test = await testService.add(name, type, contImg, posImg, negImg, bacteriaSpesif, token)
        if (test.error) {
            dispatch(setNotification({ message: test.error.substring(test.error.indexOf('name: ') + 6), success: false }))
        } else {
            dispatch(setNotification({ message: 'Testi lisätty onnistuneesti', success: true }))
            dispatch({
                type: 'ADD_TEST',
                data: test
            })
            resetTestForm()
        }
    }
}

export const deleteTest = (id, token) => {
    return async dispatch => {
        console.log('deletion to reducer ', id)
        const response = await testService.deleteTest(id, token)
        if (response.status !== 204) {
            dispatch(setNotification({ message: response.error, success: false }))
        } else {
            dispatch(setNotification({ message: 'Testi poistettiin onnistuneesti', success: true }))
            dispatch({
                type: 'DELETE_TEST',
                data: id
            })
        }
    }
}

export const updateTest = (id, name, type, contImg, photoPos, photoNeg, bacteriaSpesif, photosToDelete, token) => {
    return async dispatch => {
        const test = await testService.update(id, name, type, contImg, photoPos, photoNeg, bacteriaSpesif, photosToDelete, token)
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