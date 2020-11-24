import bacteriaService from '../services/bacteria'
import { setNotification } from '../reducers/notificationReducer'
const reducer = (state = [], action) => {
    switch (action.type) {
    case 'GET_BACTERIA': {
        return action.data
    }
    case 'ADD_BACTERIUM': {
        return [...state, action.data]
    }
    case 'DELETE_BACTERIUM': {
        return state.filter(bacterium => bacterium.id !== action.data.id)
    }
    case 'UPDATE_BACTERIUM': {
        return state.map(bacterium => (bacterium.id === action.data.id) ? { ...bacterium, name: action.data.name } : bacterium)
    }
    case 'ZERO_BACTERIUM': {
        return action.data
    }
    default: return state
    }
}


export const getBacteria = (token) => {
    return async dispatch => {
        const bacteria = await bacteriaService.get(token)
        if (bacteria.error) {
            dispatch(setNotification({ message: bacteria.error, success: false }))
        } else {
            dispatch({
                type: 'GET_BACTERIA',
                data: bacteria
            })
        }
    }
}

export const addBacteria = (name, token) => {
    return async dispatch => {
        const bacterium = await bacteriaService.add(name, token)
        if (bacterium.error) {
            dispatch(setNotification({ message: bacterium.error.substring(bacterium.error.indexOf('name: ') + 6), success: false }))
        } else {
            dispatch({
                type: 'ADD_BACTERIUM',
                data: bacterium
            })
        }
    }
}

export const deleteBacterium = (bacterium, token) => {
    return async dispatch => {
        const res = await bacteriaService.deleteBacterium(bacterium.id, token)
        if (res.status !== 204) {
            dispatch(setNotification({ message: res.error, success: false }))
        } else {
            dispatch({
                type: 'DELETE_BACTERIUM',
                data: bacterium
            })
        }
    }
}

export const updateBacterium = (id, name, token, setIsModified, setNewName) => {
    return async dispatch => {
        const bacterium = await bacteriaService.update(id, name, token)
        if (bacterium.error) {
            dispatch(setNotification({ message: bacterium.error.substring(bacterium.error.indexOf('name: ') + 6), success: false }))
        } else {
            dispatch({
                type: 'UPDATE_BACTERIUM',
                data: bacterium
            })
            setIsModified(false)
            setNewName(bacterium.name)
        }
    }
}

export const zeroBacteria = () => {
    return async dispatch => {
        dispatch({
            type: 'ZERO_BACTERIUM',
            data: []
        })
    }
}

export default reducer