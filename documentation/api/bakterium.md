# Endpoint starts with: `/api/bacteria`
Provides access to create a new bacterium, modify and delete an existing bacterium object, and fetch all added bacteria.

## `GET /api/bacteria/`
This endpoint retuns a list of all added bacteria.

|Header|value|
|Content-Type |application/json|
|Status Code|200 OK|

Response body contains array of Backterium objects:
`[
    {
        id: ObjectId,
        name: String
    },
    {
        id: ObjectId,
        name: String
    }
]`

### Errors
`401 Unauthorized`: with error message: "token missing or invalid" if current user is unauthorized. 


### `POST /api/bacteria/`
This endpoint lets teacher create a new bacterium object and returns this created object, if object was saved successfully to the database.

### Response
|Header|value|
|Content-Type |application/json|
|Status Code|201 Created|

Response body contains the saved Bacterium object:
`{
    id: ObjectId,
    name: String
}` 

### Errors
`401 Unauthorized`: with error message: "token missing or invalid" if current user unauthorized.

Not yet implemented:
`400 Bad Request`: with error message: ""  Given field `name` is empty or the name of the new bacterium is not unique.

## Not yet implemented `DELETE /api/bacteria/:id`

This endpoint lets teacher to remove bacterium object and retuns a empty body.

### Response
|Header|value|
|Content-Type |application/json|
|Status Code| 204 No Content|

Response body is empty.

### Errors
`401 Unauthorized`: with error message: "token missing or invalid" if current user is unauthorized.
`404 Not Found`: with error message: "Bacterium not found" : if no bacterium found with given id.

## Not yet implemented `PUT /api/bacteria/:id`

This endpoint lets teacher modify bacterium object and retuns modified object.

### Response
|Header|value|
|Content-Type |application/json|
|Status Code| 200 OK|

Response body is modified bacterium object:
`{
    id: ObjectId,
    name: String
}` 

### Errors
`401 Unauthorized`: with error message: "token missing or invalid" if current user is unauthorized.
`404 Not Found`: with error message: "Bacterium not found" : if no bacterium found with given id.
`400 Bad Request`: with error message: ""  Given field `name` is empty or the given name of the new bacterium is not unique.