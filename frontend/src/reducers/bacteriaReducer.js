import bacteriaService from '../services/bacteria'

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
    default: return state
    }
}


export const getBacteria = (token) => {
    return async dispatch => {
        const bacteria = await bacteriaService.get(token)
        dispatch({
            type: 'GET_BACTERIA',
            data: bacteria
        })
    }
}

export const addBacteria = (name, token) => {
    return async dispatch => {
        const bacterium = await bacteriaService.add(name, token)
        dispatch({
            type: 'ADD_BACTERIUM',
            data: bacterium
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

export default reducer