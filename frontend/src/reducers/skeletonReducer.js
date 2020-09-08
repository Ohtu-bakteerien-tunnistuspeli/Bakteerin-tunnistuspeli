import skeletonService from '../services/skeleton'

const reducer = (state = '', action) => {
    switch (action.type) {
    case 'ZERO_MESSAGE': {
        return action.data
    }
    case 'GET_MESSAGE': {
        return action.data
    }
    case 'GET_SECURED_MESSAGE': {
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


export const getSecuredMessage = () => {
    return async dispatch => {
        const message = await skeletonService.getSecured('bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InVzZXJuYW1lIiwiaWF0IjoxNTk5NTU4OTYxfQ.pJB1bVHDv0cA4_nW94JhtVuTFnbQACSd7KdH1U7bgfU')
        dispatch({
            type: 'GET_SECURED_MESSAGE',
            data: message
        })
    }
}

export default reducer