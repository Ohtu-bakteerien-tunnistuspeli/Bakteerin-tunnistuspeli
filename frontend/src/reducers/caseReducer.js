import caseService from '../services/case'
import { setNotification } from '../reducers/notificationReducer'

const reducer = (state = [], action) => {
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

export const addCase = (name, bacterium, anamnesis, completionImage, samples, testGroups, token, resetCaseForm) => {
    return async dispatch => {
        const caseToSave = await caseService.add(name, bacterium, anamnesis, completionImage, samples, testGroups, token)
        if (caseToSave.error) {
            dispatch(setNotification({ message: caseToSave.error.substring(caseToSave.error.indexOf('name: ') + 6), success: false }))
        } else {
            dispatch({
                type: 'ADD_CASE',
                data: caseToSave
            })
            resetCaseForm()
        }
    }
}

export default reducer