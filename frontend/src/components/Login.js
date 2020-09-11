import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { login } from '../reducers/userReducer'
import { useHistory } from 'react-router-dom'
import { setNotification } from '../reducers/notificationReducer'

const Login = () => {
onSubmit={handleLogin}
    const dispatch = useDispatch()
    const history = useHistory()
    const user = useSelector(state => state.user)
    const handleLogin = async (event) => {
        event.preventDefault()
        const username = event.target.username.value
        const password = event.target.password.value
        console.log('logging in with', username, password)
        try {
            dispatch(login(username, password))
            dispatch(setNotification({ message: `You Logged In succesfully, ${username}`}))
        } catch (exeption) {
            console.log('Error occured in login')
        }
    }
    useEffect(() => {
        if(user) {
            history.push('/bakteeriLista')
        }
    }, [user, history])
    return (
        <div>
            <h2>Log in to Bakteeripeli</h2>

            <form onSubmit={handleLogin}>
                <div>
                    username
                    <input
                        id="username" name="username" />
                </div>
                <div>
                    password
                    <input
                        id = "password"
                        type="password"
                        name="password"
                    />
                </div>
                <button id="submit" type="submit">login</button>
            </form>
        </div>
    )
}

export default Login