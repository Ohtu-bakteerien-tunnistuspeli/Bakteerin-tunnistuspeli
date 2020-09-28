# Endpoint starts with: `/api/test`
Provides access to create a new test, modify and delete an existing test object, and fetch all added tests.

## `GET /api/test/`
This endpoint retuns a list of all added test cases.


| Header        |  Value        |
| ------------- |:-------------:|
| Content-Type  | application/json |
| Status Code   | 200 OK    |

Response body contains array of Test objects, each returned object contains at least id, name, type and empty array of bacteriaSpecificImages:
```
[
    {
        id: ObjectId,
        name: String,
        type: String
        bacteriaSpecificImages: [],
    },
    {
        id: ObjectId,
        name: String,
        type: String
        controlImage: {
            data: Buffer,
            contentType: String
        },
        positiveResultImage: {
            data: Buffer,
            contentType: String
        },
        negativeResultImage: {
            data: Buffer,
            contentType: String
        },
        bacteriaSpecificImages: [{
            bacterium: {
                name: String,
                id: String
            },
            data: Buffer,
            contentType: String
        }], 
    }
]
```    
### Errors
`401 Unauthorized`: with error message: "token missing or invalid" if current user is unauthorized. 


### `POST /api/test/`
This endpoint lets teacher (admin role) create a new Test object and returns this created object, if object was saved successfully to the database.

### Response
| Header        |  Value        |
| ------------- |:-------------:|
| Content-Type  | application/json |
|Status Code|201 Created|

Response body contains the saved Test object, which contains at least fields `id`, `name`, `type` and `bacteriaSpecificImages`, which can be empty array if no images added. If data was added to any of the fields `controlImage`, `positiveResultImage`, `negativeResultImage`, this is also returned:
```
{
    id: ObjectId,
    name: String,
    type: String,
    controlImage: {
      data: Buffer,
      contentType: String
    },
    positiveResultImage: {
      data: Buffer,
      contentType: String
    },
    negativeResultImage: {
      data: Buffer,
      contentType: String
    },
    bacteriaSpecificImages: [{
      bacterium: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Bacterium'
      },
      data: Buffer,
      contentType: String
    }], 
}
```


### Errors
`401 Unauthorized`: with error message: "token missing or invalid" if current user is unauthorized.\
`400 Bad Request`: with error messages: "Testin nimen tulee olla vähintään 2 merkkiä pitkä.",  if given field `name` is less than 2 characters long.\
`400 Bad Request`: with error messages: "Testin tyypin tulee olla vähintään 2 merkkiä pitkä.",  if given field `type` is less than 2 characters long.\
`400 Bad Request`: with error messages: "Testin nimen tulee olla enintään 100 merkkiä pitkä.",  if given field `name` is more than 100 characters long.\
`400 Bad Request`: with error messages: "Testin tyypin tulee olla enintään 100 merkkiä pitkä.",  if given field `type` is more than 100 characters long.\
`400 Bad Request`: with error messages: "Testin nimen tulee olla uniikki.",  if modified name of the test is not unique.

## `DELETE /api/test/:id`

This endpoint lets teacher (admin role) to remove Test object and retuns a empty body.

### Response
| Header        |  Value        |
| ------------- |:-------------:|
| Content-Type      | application/json |
|Status Code| 204 No Content|

Response body is empty.

### Errors
`401 Unauthorized`: with error message: "token missing or invalid" if current user is unauthorized.\
`204 No Content`: with error message: "Annettua testiä ei löydy tietokannasta" : if no test found with given id.\
`400 Bad request`: with error message: "Testi on käytössä ainakin yhdessä tapauksessa, eikä sitä voida poistaa." : if test with given id is used in one ore more case objects.

## `PUT /api/test/:id`

This endpoint lets teacher (admin role) modify Test object and retuns modified object.

### Response
| Header        |  Value        |
| ------------- |:-------------:|
| Content-Type  | application/json |
| Status Code | 200 OK|

Response body is modified Test object, which contains at least fields `id`, `name`, `type` and `bacteriaSpecificImages`, which can be an empty array if no images added or modified:
```{
    id: ObjectId,
    name: String,
    type: String,
    controlImage: {
      data: Buffer,
      contentType: String
    },
    positiveResultImage: {
      data: Buffer,
      contentType: String
    },
    negativeResultImage: {
      data: Buffer,
      contentType: String
    },
    bacteriaSpecificImages: [{
      bacterium: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Bacterium'
      },
      data: Buffer,
      contentType: String
    }], 
}
```

### Errors
`204 No Content`: with error message: "Annettua testiä ei löydy tietokannasta" : if no bacterium found with given id.\
`401 Unauthorized`: with error message: "token missing or invalid" if current user unauthorized.\
`400 Bad Request`: with error messages: "Testin nimen tulee olla vähintään 2 merkkiä pitkä.",  if given field `name` is under 2 characters long.\
`400 Bad Request`: with error messages: "Testin tyypin tulee olla vähintään 2 merkkiä pitkä.",  if given field `type` is under 2 characters long.\
`400 Bad Request`: with error messages: "Testin nimen tulee olla enintään 100 merkkiä pitkä.",  if given field `name` is over 100 characters long.\
`400 Bad Request`: with error messages: "Testin tyypin tulee olla enintään 100 merkkiä pitkä.",  if given field `type` is over 100 characters long.\
`400 Bad Request`: with error messages: "Testin nimen tulee olla uniikki.",  if modified name of the test was not unique.
