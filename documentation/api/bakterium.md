# Endpoint starts with: `/api/bacteria`
Provides access to create a new bacterium and fetch all added bacteria.

## `GET /api/bacteria/`
This "/" -endpoint provides a list of all added bacteria.
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
`401 Unauthorized`: if user is not authorized. 
### `POST /api/bacteria/create/`
This "/create/" -endpoint returns a Bacterium object, if object was saved successfully to the database.

### Response
|Header|value|
|Content-Type |application/json|
|Status Code|201 CREATED|

Response body contains newly added Bacterium object:
`{
    id: ObjectId,
    name: String
}` 

### Errors
`401 Unauthorized`: if user is not authorized.

Not yet implemented:
`400 Bad Request`: This error happens, if field `name` is empty or the name of the new bacterium is not unique.