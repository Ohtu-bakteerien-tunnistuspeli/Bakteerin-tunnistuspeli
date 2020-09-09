import bacteriaService from '../services/bacteria'

const reducer = (state = null, action) => {
    switch (action.type) {
        case 'GET_BACTERIA': {
            return action.data
        }
        case 'ADD_BACTERIUM': {
            return [...state, action.data]
        }
        default: return state
    }
}


export const getBacteria = () => {
    return async dispatch => {
        const bacteria = await bacteriaService.get()
        dispatch({
            type: 'GET_BACTERIA',
            data: bacteria
        })

    }
}

export const addBacteria= (name) => {
    return async dispatch => {
        const bacterium = await bacteriaService.add(name)
        dispatch({
            type: 'ADD_BACTERIUM',
            data: bacterium
        })

    }
}


export default reducer