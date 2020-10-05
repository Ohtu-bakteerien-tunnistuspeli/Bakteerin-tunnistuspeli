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
    case 'DELETE_CASE': {
        return state.filter(ca => ca.id !== action.data.id)
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
            dispatch(setNotification({ message: caseToSave.error, success: false }))
        } else {
            dispatch(setNotification({ message: `Tapauksen ${caseToSave.name} lisäys onnistui.`, success: true }))
            dispatch({
                type: 'ADD_CASE',
                data: caseToSave
            })
            resetCaseForm()
        }
    }
}

export const deleteCase = (caseToDelete, token) => {
    return async dispatch => {
        const res = await caseService.deleteCase(caseToDelete.id, token)
        if (res.status !== 204) {
            dispatch(setNotification({ message: res.error, success: false }))
        } else {
            dispatch({
                type: 'DELETE_CASE',
                data: caseToDelete
            })
        }
    }
}

export default reducer