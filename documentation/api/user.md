# Endpoint starts with: `/api/user`
Provides access to login and register.

## `POST /api/user/login`
This endpoint lets user login.  
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
        usernname: String
    }
`

### Errors
`400 Bad Request` with error message `Invalid username or password`: if given username and password combination does not exist. 

## Not yet implemented: `POST /api/user/register`
This endpoint lets user register.  
Request body should contain JSON:
`
    {
        username: String,
        password: String,
        passwordAgain: String
    }
`

|Header|value|
|Content-Type |application/json|
|Status Code|200 OK|

(If logging in automatically:
Response body contains User object:
`
    {
        token: String,
        usernname: String
    }
`
)

### Errors
`400 Bad Request` with error message `Username already exists`: if given username and password combination does not exist.  
`400 Bad Request` with error message `Passwords do not match`: if password and passwordAgain do not match.