import bacteriaService from '../services/bacteria'
import { setNotification } from '../reducers/notificationReducer'
const reducer = (state = null, action) => {
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
        default: return state
    }
}


export const getBacteria = (token) => {
    return async dispatch => {
        const response = await bacteriaService.get(token)
        if (response.error) {
            dispatch(setNotification({ message: response.data }))
            return
        }
        dispatch({
            type: 'GET_BACTERIA',
            data: response.data
        })
    }
}

export const addBacteria = (name, token) => {
    return async dispatch => {
        const response = await bacteriaService.add(name, token)
        if (response.error) {
            dispatch(setNotification({ message: response.data }))
            return
        }
        dispatch({
            type: 'ADD_BACTERIUM',
            data: response.data
        })
    }
}

export const deleteBacterium = (bacterium, token) => {
    return async dispatch => {
        const res = await bacteriaService.deleteBacterium(bacterium.id, token)
        console.log(res.status)
        dispatch({
            type: 'DELETE_BACTERIUM',
            data: bacterium
        })
    }
}

export const updateBacterium = (id, name, token) => {
    return async dispatch => {
        const response = await bacteriaService.update(id, name, token)
        if (response.error) {
            dispatch(setNotification({ message: response.data }))
            return
        }
        dispatch({
            type: 'UPDATE_BACTERIUM',
            data: response.data
        })
    }
}

export default reducer