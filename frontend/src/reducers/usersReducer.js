import userService from '../services/user'
import { setNotification } from './notificationReducer'

const reducer = (state = [], action) => {
    switch (action.type) {
    case 'GET_USERS': {
        return action.data
    }
    case 'DELETE_USER': {
        return state.filter(user => user.id !== action.data.id)
    }
    case 'PROMOTE_USER': {
        return state.map(user => (user.id === action.data.id) ? { ...user, admin: true } : user)
    }
    case 'DEMOTE_USER': {
        return state.map(user => (user.id === action.data.id) ? { ...user, admin: false } : user)
    }
    case 'ZERO_USERS': {
        return action.data
    }
    default: return state
    }
}

export const getUsers = (token) => {
    return async dispatch => {
        const users = await userService.get(token)
        if (users.error) {
            dispatch(setNotification({ message: users.error, success: false }))
        } else {
            dispatch({
                type: 'GET_USERS',
                data: users
            })
        }
    }
}

export const deleteUser = (user, token) => {
    return async dispatch => {
        const res = await userService.deleteUser(user.id, token)
        if (res.status !== 204) {
            dispatch(setNotification({ message: res.error, success: false }))
        } else {
            dispatch({
                type: 'DELETE_USER',
                data: user
            })
            dispatch(setNotification({ message: `Käyttäjän ${user.username} poisto onnistui.`, success: true }))
        }
    }
}

export const promoteUser = (id, token) => {
    return async dispatch => {
        const user = await userService.promote(id, token)
        if (user.error) {
            dispatch(setNotification({ message: user.error.substring(user.error.indexOf('name: ') + 6), success: false }))
        } else {
            dispatch({
                type: 'PROMOTE_USER',
                data: user
            })
            dispatch(setNotification({ message: `Käyttäjän ${user.username} ylennys onnistui.`, success: true }))
        }
    }
}

export const demoteUser = (id, token) => {
    return async dispatch => {
        const user = await userService.demote(id, token)
        if (user.error) {
            dispatch(setNotification({ message: user.error.substring(user.error.indexOf('name: ') + 6), success: false }))
        } else {
            dispatch({
                type: 'DEMOTE_USER',
                data: user
            })
            dispatch(setNotification({ message: `Käyttäjän ${user.username} alennus onnistui.`, success: true }))
        }
    }
}

export const zeroUsers = () => {
    return async dispatch => {
        dispatch({
            type: 'ZERO_USERS',
            data: []
        })
    }
}

export default reducer