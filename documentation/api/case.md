# Endpoint starts with: `/api/case`
Provides access to create a new case, modify and delete an existing case object, and fetch all added cases.

## `GET /api/case/`
This endpoint retuns a list of all added cases.


| Header        |  Value        |
| ------------- |:-------------:|
| Content-Type  | application/json |
| Status Code   | 200 OK    |

Response body contains array of Case objects, each returned object contains at least id, name and complete:
```
[
    {
        id: ObjectId,
        name: String,
		complete: Boolean
    },
    {
        id: ObjectId,
        name: String,
        bacterium: {
            name: String,
            id: ObjectId
        },
		anamnesis: String,
        completitionText: {
            data: Buffer,
            contentType: String
        },
        samples: [{
			description: String,
			rightAnswer: Boolean
		}],
		testGroups: [[{
			test: {
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
						id: ObjectId
					},
					data: Buffer,
					contentType: String
				}], 
			}
		}]],
		complete: Boolean
    }
]
```    
### Errors
`401 Unauthorized`: with error message: "token missing or invalid" if current user is unauthorized. 


### `POST /api/case/`
This endpoint lets teacher (admin role) create a new Case object and returns this created object, if object was saved successfully to the database.

### Response
| Header        |  Value        |
| ------------- |:-------------:|
| Content-Type  | application/json |
|Status Code|201 Created|

Response body contains the saved Case object, which contains at least fields `id`, `name`, and `complete`. If data was added to any of the fields `bacterium`, `anamnesis`, `completitionText`, `samples`, `testGroups`, this is also returned:
```
{
    id: ObjectId,
    name: String,
	complete: Boolean
},
{
    id: ObjectId,
    name: String,
    bacterium: {
        name: String,
        id: ObjectId
    },
	anamnesis: String,
    completitionText: {
        data: Buffer,
        contentType: String
    },
    samples: [{
		description: String,
		rightAnswer: Boolean
	}],
	testGroups: [[{
		test: {
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
					id: ObjectId
				},
				data: Buffer,
				contentType: String
			}], 
		}
	}]],
	complete: Boolean
}
```


### Errors
`401 Unauthorized`: with error message: "token missing or invalid" if current user is unauthorized.\
`400 Bad Request`: with error messages: "Tapauksen nimen tulee olla vähintään 2 merkkiä pitkä.",  if given field `name` is less than 2 characters long.\
`400 Bad Request`: with error messages: "Tapauksen nimen tulee olla enintään 100 merkkiä pitkä.",  if given field `name` is more than 100 characters long.\
`400 Bad Request`: with error messages: "Tapauksen nimen tulee olla uniikki.",  if modified name of the case is not unique.\
`400 Bad Request`: with error messages: "Annettua bakteeria ei löydy.", if given bacterium is not found.\
`400 Bad Request`: with error messages: "Annettua testiä ei löydy.", if given test is not found.

## `DELETE /api/case/:id`

This endpoint lets teacher (admin role) to remove Case object and retuns a empty body.

### Response
| Header        |  Value        |
| ------------- |:-------------:|
| Content-Type      | application/json |
|Status Code| 204 No Content|

Response body is empty.

### Errors
`401 Unauthorized`: with error message: "token missing or invalid" if current user is unauthorized.\

## `PUT /api/case/:id`

This endpoint lets teacher (admin role) modify Case object and retuns modified object.

### Response
| Header        |  Value        |
| ------------- |:-------------:|
| Content-Type  | application/json |
| Status Code | 200 OK|

Response body is modified Case object, which contains at least fields which contains at least fields `id`, `name`, and `complete`:
```
{
    id: ObjectId,
    name: String,
    bacterium: {
        name: String,
        id: ObjectId
    },
	anamnesis: String,
    completitionText: {
        data: Buffer,
        contentType: String
    },
    samples: [{
		description: String,
		rightAnswer: Boolean
	}],
	testGroups: [[{
		test: {
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
					id: ObjectId
				},
				data: Buffer,
				contentType: String
			}], 
		}
	}]],
	complete: Boolean
}
```

### Errors
`401 Unauthorized`: with error message: "token missing or invalid" if current user is unauthorized.\
`400 Bad Request`: with error message: "Annettua tapausta ei löydy tietokannasta." : if no case found with given id.\
`400 Bad Request`: with error messages: "Tapauksen nimen tulee olla vähintään 2 merkkiä pitkä.",  if given field `name` is less than 2 characters long.\
`400 Bad Request`: with error messages: "Tapauksen nimen tulee olla enintään 100 merkkiä pitkä.",  if given field `name` is more than 100 characters long.\
`400 Bad Request`: with error messages: "Tapauksen nimen tulee olla uniikki.",  if modified name of the case is not unique.\
`400 Bad Request`: with error messages: "Annettua bakteeria ei löydy.", if given bacterium is not found.\
`400 Bad Request`: with error messages: "Annettua testiä ei löydy.", if given test is not found.

