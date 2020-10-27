# Endpoint starts with: `/api/credit`
Provides access to delete an existing credit object, and fetch all added credits.

## `GET /api/credit/`
This endpoint retuns a list of all added credits.


| Header        |  Value        |
| ------------- |:-------------:|
| Content-Type  | application/json |
| Status Code   | 200 OK    |

Response body contains array of Credit objects, each returned object contains fields id, user and testCases:
```
[
    {
        id: ObjectId,
        user: ObjectId,
		testCases: [{
			type: String
		}]
    }
]
```    
### Errors
`401 Unauthorized`: with error message: "token missing or invalid" if current user is unauthorized. 

## `DELETE /api/credit/`

This endpoint lets teacher (admin role) to remove Credit objects and retuns a empty body.

### Response
| Header        |  Value        |
| ------------- |:-------------:|
| Content-Type      | application/json |
|Status Code| 204 No Content|

Request body is array of ids of credits that are to be deleted:
```
[ObjectId]
``` 

Response body is empty.

### Errors
`401 Unauthorized`: with error message: "token missing or invalid" if current user is unauthorized.\
