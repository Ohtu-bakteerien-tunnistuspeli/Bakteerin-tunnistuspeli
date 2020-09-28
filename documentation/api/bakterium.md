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
This endpoint lets teacher (admin role) create a new bacterium object and returns this created object, if object was saved successfully to the database.

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
`400 Bad Request`: with error messages: "Bakteerin nimen tulee olla vähintään 2 merkkiä pitkä.",  if given field `name` is under 2 characters long.\
`400 Bad Request`: with error messages: "Bakteerin nimen tulee olla enintään 100 merkkiä pitkä.",  if given field `name` is over 100 characters long.\
`400 Bad Request`: with error messages: "Bakteerin nimen tulee olla uniikki.",  if given name of the new bacterium is not unique.

## `DELETE /api/bacteria/:id`

This endpoint lets teacher (admin role) to remove bacterium object and retuns a empty body.

### Response
|Header|value|
|Content-Type |application/json|
|Status Code| 204 No Content|

Response body is empty.

### Errors
`401 Unauthorized`: with error message: "token missing or invalid" if current user is unauthorized.\
`404 Not Found`: with error message: "Annettua bakteeria ei löydy tietokannasta" : if no bacterium found with given id.\
`400 Bad request`: with error message: "Bakteeri on käytössä testissä eikä sitä voi poistaa." : if no bacterium found with given id.

## `PUT /api/bacteria/:id`

This endpoint lets teacher (admin role) modify bacterium object and retuns modified object.

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
`404 Not Found`: with error message: "Annettua bakteeria ei löydy tietokannasta" : if no bacterium found with given id.\
`401 Unauthorized`: with error message: "token missing or invalid" if current user unauthorized.\
`400 Bad Request`: with error messages: "Bakteerin nimen tulee olla vähintään 2 merkkiä pitkä.",  if given field `name` is under 2 characters long.\
`400 Bad Request`: with error messages: "Bakteerin nimen tulee olla enintään 100 merkkiä pitkä.",  if given field `name` is over 100 characters long.\
`400 Bad Request`: with error messages: "Bakteerin nimen tulee olla uniikki.",  if given name of the new bacterium is not unique.
