import userService from '../services/user'
import { setNotification } from './notificationReducer'
import { getBacteria, zeroBacteria } from './bacteriaReducer'
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


export const login = (username, password, history) => {
    return async dispatch => {
        let user = await userService.login({ username, password })
        if (user && !user.error) {
            user.token = `bearer ${user.token}`
            window.localStorage.setItem('loggedUser', JSON.stringify(user))
            dispatch(setNotification({ message: `You Logged In succesfully, ${username}`, success: true }))
            dispatch({
                type: 'LOGIN',
                data: user
            })
            dispatch(getBacteria(user.token))
            history.push('/bakteeriLista')
        } else {
            dispatch({
                type: 'LOGIN',
                data: null
            })
            dispatch(setNotification({ message: 'Login Failed', success: false }))
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
        history.push('/login')
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
        }
        dispatch({
            type: 'RETURN_USER',
            data: user
        })
    }
}

export default reducer