import gameService from '../services/game'
import { setNotification } from '../reducers/notificationReducer'
const reducer = (state = null, action) => {
    switch (action.type) {
    case 'GET_GAME': {
        return action.data
    }
    case 'CHECK_SAMPLES': {
        return action.data
    }
    case 'ZERO_GAME': {
        return action.data
    }
    default: return state
    }
}


export const getGame = (history, id, token) => {
    return async dispatch => {
        const receivedCase = await gameService.get(id, token)
        if (receivedCase.error) {
            dispatch(setNotification({ message: receivedCase.error, success: false }))
        } else {
            let game = {
                case: receivedCase,
                samplesCorrect: false,
                requiredTestsDone: false,
                allTestsDone: false,
                bacteriumCorrect: false,
                correctTests: []
            }
            dispatch({
                type: 'GET_GAME',
                data: game
            })
            history.push('/peli')
        }
    }
}

export const checkSamples = (game, samples, token) => {
    return async dispatch => {
        const checkSample = await gameService.get(game.case.id, samples, token)
        if (checkSample.error) {
            dispatch(setNotification({ message: receivedCase.error, success: false }))
        } else {
            if(checkSample.correct) {
                dispatch(setNotification({ message: 'Oikea vastaus', success: true }))
                dispatch({
                    type: 'CHECK_SAMPLES',
                    data: {...game, samplesCorrect: true}
                })
            } else {
                dispatch(setNotification({ message: 'Väärä vastaus', success: false }))
            }
            
        }
    }
}

export const zeroGame = () => {
    return async dispatch => {
        dispatch({
            type: 'ZERO_GAME',
            data: null
        })
    }
}

export default reducer