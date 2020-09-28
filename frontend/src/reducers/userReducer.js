import userService from '../services/user'
import { setNotification } from './notificationReducer'
import { getBacteria, zeroBacteria } from './bacteriaReducer'
import { getTests } from './testReducer'
const reducer = (state = null, action) => {
    switch (action.type) {
    case 'LOGIN': {
        return action.data
    }
    case 'LOGOUT': {
        return action.data
    }
    case 'RETURN_USER': {
        return action.data
    }
    case 'REGISTER': {
        return action.data
    }
    default: return state
    }
}


export const login = (username, password, history) => {
    return async dispatch => {
        let user = await userService.login({ username, password })
        if (user && !user.error) {
            user.token = `bearer ${user.token}`
            window.localStorage.setItem('loggedUser', JSON.stringify(user))
            dispatch(setNotification({ message: `Kirjauduit sisään onnistuneesti, ${username}`, success: true }))
            dispatch({
                type: 'LOGIN',
                data: user
            })
            dispatch(getBacteria(user.token))
            dispatch(getTests(user.token))
            history.push('/bakteeriLista')
        } else {
            dispatch({
                type: 'LOGIN',
                data: null
            })
            dispatch(setNotification({ message: 'Kirjautuminen epäonnistui', success: false }))
        }
    }
}

export const logout = (history) => {
    return async dispatch => {
        window.localStorage.removeItem('loggedUser')
        dispatch({
            type: 'LOGOUT',
            data: null
        })
        history.push('/kirjautuminen')
        dispatch(zeroBacteria())
    }
}

export const returnUser = () => {
    return async dispatch => {
        const userText = window.localStorage.getItem('loggedUser')
        let user = null
        if (userText) {
            user = JSON.parse(userText)
            dispatch(getBacteria(user.token))
            dispatch(getTests(user.token))
        }
        dispatch({
            type: 'RETURN_USER',
            data: user
        })
    }
}

export const register = (username, password, history) => {
    return async dispatch => {
        let response = await userService.register({ username, password })
        if (response && !response.error) {
            dispatch(setNotification({ message: `Rekisteröidyit onnistuneesti, ${username}`, success: true }))
            history.push('/kirjautuminen')
        } else {
            dispatch({
                type: 'REGISTER',
                data: null
            })
            if(response.error.includes("User validation failed")) {
                dispatch(setNotification({ message: response.error.substring(response.error.indexOf('name: ') + 6), success: false }))
            } else {
                dispatch(setNotification({ message: response.error, success: false }))
            }   
        }
    }
}

export default reducer