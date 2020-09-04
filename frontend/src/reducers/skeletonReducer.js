import skeletonService from '../services/skeleton'

const reducer = (state = '', action) => {
    switch (action.type) {
    case 'ZERO_MESSAGE': {
        return action.data
    }
    case 'GET_MESSAGE': {
        return action.data
    }
    default: return state
    }
}

export const zeroMessage = () => {
    return async dispatch => {
        dispatch({
            type: 'ZERO_MESSAGE',
            data: ''
        })
    }
}

export const getMessage = () => {
    return async dispatch => {
        const message = await skeletonService.get()
        dispatch({
            type: 'GET_MESSAGE',
            data: message
        })
    }
}

export default reducer