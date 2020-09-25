import caseService from '../services/case'
import { setNotification } from '../reducers/notificationReducer'

const reducer = (state = null, action) => {
    switch (action.type) {
    case 'GET_CASES': {
        return action.data
    }
    case 'ADD_CASE': {
        return [...state, action.data]
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

export const addCase2 = (name, bacterium, anamnesis, compText, samples, testGroups, token) => {
    return async dispatch => {
        const caseToSave = await caseService.add(name, bacterium, anamnesis, compText, samples, testGroups, token)
        if (test.error) {
            dispatch(setNotification({ message: test.error.substring(test.error.indexOf('name: ') + 6), success: false }))
        } else {
            dispatch({
                type: 'ADD_CASE',
                data: caseToSave
            })
        }
    }
}

export default reducer