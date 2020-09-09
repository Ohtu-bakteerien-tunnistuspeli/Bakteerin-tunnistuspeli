import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { login } from '../reducers/userReducer'

const Login = () => {

  const dispatch = useDispatch()

  const handleLogin = async (event) => {
    event.preventDefault()
    const username = event.target.username.value
    const password = event.target.password.value
    console.log('logging in with', username, password)
    try {
      dispatch(login(username, password))
    } catch (exeption) {
      console.log("Error occured in login")
    }

  }
  return (
    <div>
      <h2>Log in to Bakteeripeli</h2>

      <form onSubmit={handleLogin}>
        <div>
          username
                  <input
            name="username" />
        </div>
        <div>
          password
                  <input
            type="password"
            name="password"
          />
        </div>
        <button type="submit">login</button>
      </form>
    </div>
  )
}

export default Login