# Endpoint starts with: `/api/user`
Provides access to login and register.

## `POST /api/user/login`
This endpoint lets user to login.  
Request body should contain JSON:
`
    {
        username: String,
        password: String
    }
`

|Header|value|
|Content-Type |application/json|
|Status Code|200 OK|


Response body contains User object:
`
    {
        token: String,
        username: String
    }
`

### Errors
`401 Invalid username or password`: if given username and password combination does not exist. 
