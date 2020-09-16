import userService from '../services/user'
import { setNotification } from './notificationReducer'

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
    default: return state
    }
}


export const login = (username, password) => {
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
        } else {
            dispatch({
                type: 'LOGIN',
                data: null
            })
            dispatch(setNotification({ message: 'Login Failed', success: false }))
        }
    }
}

export const logout = () => {
    return async dispatch => {
        window.localStorage.removeItem('loggedUser')
        dispatch({
            type: 'LOGOUT',
            data: null
        })
    }
}

export const returnUser = () => {
    return async dispatch => {
        const userText = window.localStorage.getItem('loggedUser')
        let user = null
        if (userText) {
            user = JSON.parse(userText)
        }
        dispatch({
            type: 'RETURN_USER',
            data: user
        })
    }
}

export default reducer