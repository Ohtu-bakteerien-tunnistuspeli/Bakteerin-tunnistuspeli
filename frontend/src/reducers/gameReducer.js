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
    case 'CHECK_TESTS': {
        return action.data
    }
    case 'CHECK_BACTERIUM': {
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
                correctTests: [],
                testResults: [],
                completionImageUrl: null
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
        const checkSample = await gameService.sampleCheck(game.case.id, samples, token)
        if (checkSample.error) {
            dispatch(setNotification({ message: checkSample.error, success: false }))
        } else {
            if (checkSample.correct) {
                dispatch(setNotification({ message: 'Oikea vastaus', success: true }))
                dispatch({
                    type: 'CHECK_SAMPLES',
                    data: { ...game, samplesCorrect: true }
                })
            } else {
                dispatch(setNotification({ message: 'Väärä vastaus', success: false }))
            }

        }
    }
}

export const checkTests = (game, test, token) => {
    return async dispatch => {
        const checkTest = await gameService.testCheck(game.case.id, { tests: [...game.correctTests, test] }, token)
        if (checkTest.error) {
            dispatch(setNotification({ message: checkTest.error, success: false }))
        } else {
            if (checkTest.correct) {
                if (checkTest.allDone) {
                    dispatch(setNotification({ message: 'Oikea vastaus. Kaikki testit tehty.', success: true }))
                } else if (checkTest.requiredDone) {
                    dispatch(setNotification({ message: 'Oikea vastaus. Kaikki vaaditut testit tehty.', success: true }))
                } else {
                    dispatch(setNotification({ message: 'Oikea vastaus.', success: true }))
                }
                dispatch({
                    type: 'CHECK_TESTS',
                    data: { ...game, correctTests: [...game.correctTests, test], testResults: [...game.testResults, { imageUrl: checkTest.imageUrl, testName: checkTest.testName }], requiredTestsDone: checkTest.requiredDone, allTestsDone: checkTest.allDone }
                })
            } else {
                if(checkTest.hint) {
                    dispatch(setNotification({ message: checkTest.hint, success: false }))
                } else {
                    dispatch(setNotification({ message: 'Väärä vastaus', success: false }))
                }    
            }

        }
    }
}

export const checkBacterium = (game, bacteriumName, token) => {
    return async dispatch => {
        const checkBacterium = await gameService.bacteriumCheck(game.case.id, { bacteriumName }, token)
        if (checkBacterium.error) {
            dispatch(setNotification({ message: checkBacterium.error, success: false }))
        } else {
            if (checkBacterium.correct) {
                dispatch(setNotification({ message: 'Oikea vastaus', success: true }))
                dispatch({
                    type: 'CHECK_BACTERIUM',
                    data: { ...game, bacteriumCorrect: true, completionImageUrl: checkBacterium.completionImageUrl }
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