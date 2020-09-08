import React, { useState } from 'react'

const Login = () => {

    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')

    const handleLogin = (event) => {
        event.preventDefault()
        console.log('logging in with', username, password)
    }
          return (
            <div>
              <h2>Log in to application</h2>
              {/* <Notification message={errorMessage} />*/}

              <form onSubmit={handleLogin}>
                <div>
                  username
                  <input
                    id="username"
                    type="text"
                    value={username}
                    name="Username"
                    onChange={({ target }) => setUsername(target.value)}
                  />
                </div>
                <div>
                  password
                  <input
                    id="password"
                    type="password"
                    value={password}
                    name="Password"
                    onChange={({ target }) => setPassword(target.value)}
                  />
                </div>
                <button id="submit" type="submit">login</button>
              </form>
            </div>
          )
}

export default Login