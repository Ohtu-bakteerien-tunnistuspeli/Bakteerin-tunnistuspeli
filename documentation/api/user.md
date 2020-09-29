# Endpoint starts with: `/api/user`
Provides access to login and register.

## `POST /api/user/login`
This endpoint lets user login.  
Request body should contain JSON:
``` 
    {
        username: String,
        password: String
    }
```

| Header        |  Value        |
| ------------- |:-------------:|
| Content-Type  | application/json |
| Status Code | 200 OK|


Response body contains User object:
```
    {
        token: String,
        username: String
    }
```

### Errors
`400 Bad Request` with error message `Invalid username or password`: if given username and password combination does not exist. 

## `POST /api/user/register`
This endpoint lets user register.  
Request body should contain JSON:
```
    {
        username: String,
        password: String,
    }
```

| Header        |  Value        |
| ------------- |:-------------:|
| Content-Type  | application/json |
| Status Code | 200 OK|

### Errors
`400 Bad Request`: with error messages: "Käyttäjänimen tulee olla uniikki.": if given username of the new user is not unique.\  
`400 Bad Request`: with error messages: "Käyttäjänimen tulee olla vähintään 2 merkkiä pitkä.",  if given field `username` is less than 2 characters long.\
`400 Bad Request`: with error messages: "Käyttäjänimen tulee olla enintään 100 merkkiä pitkä.",  if given field `username` is more than 100 characters long.\
`400 Bad Request`: with error messages: "Käyttäjänimi on pakollinen.",  if given field `username` is empty.\
`400 Bad Request`: with error messages: "Salasana on pakollinen.",  if given field `password` is empty.\
`400 Bad Request`: with error messages: "Salasanan täytyy olla vähintään 3 merkkiä pitkä.",  if given field `password` is less than 3 characters long.\

