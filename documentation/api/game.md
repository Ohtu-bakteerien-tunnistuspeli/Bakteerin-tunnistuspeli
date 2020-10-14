# Endpoint starts with: `/api/game`
Provides access to get case for playing and checking samples, tests and bacterium.

## `GET /api/game/:id`
This endpoint retuns a case for playing.


| Header        |  Value        |
| ------------- |:-------------:|
| Content-Type  | application/json |
| Status Code   | 200 OK    |

Response body contains a Case object :
```
{
	id: ObjectId,
	name: String,
	anamnesis: String,
	samples: [{
		description: String
	}]
}
```    
### Errors
`400 Bad Request`: if case with given id is not found.\
`401 Unauthorized`: with error message: "token missing or invalid" if current user is unauthorized. 


### `POST /api/game/:id/checkSamples`
This endpoint is used for checking if given samples are correct.  

| Header        |  Value        |
| ------------- |:-------------:|
| Content-Type  | application/json |
| Status Code   | 200 OK    |

Request body contains JSON with key samples that has array of sample names:  
```
{
	samples: [String]
}
```  

Response body contains JSON with key correct that tells if given samples were correct answer:  
```
{
	correct: Boolean
}
```    
### Errors
`400 Bad Request`: if case with given id is not found.\
`401 Unauthorized`: with error message: "token missing or invalid" if current user is unauthorized. 


### `POST /api/game/:id/checkTests`
This endpoint is used for checking if given tests are correct.  

| Header        |  Value        |
| ------------- |:-------------:|
| Content-Type  | application/json |
| Status Code   | 200 OK    |

Request body contains JSON with key tests that has array of test ids:  
```
{
	tests: [String || ObjectId]
}
```  

Response body contains JSON that always has key correct that tells if given tests were correct answer and if they were correct it also has key requiredDone that tells if all required tests are done, allDone that tells if all tests are done and testName that has the name of the latest test and imageUrl that has the url of the latest test's result image:  
```
{
	correct: false
}  
{  
	correct: true,
	requiredDone: Boolean,
	allDone: Boolean,
	testName: String,
	imageUrl: String
}
```    
### Errors
`400 Bad Request`: if case with given id is not found.\
`401 Unauthorized`: with error message: "token missing or invalid" if current user is unauthorized. 


### `POST /api/game/:id/checkBacterium`
This endpoint is used for checking if given bacterium is correct.  

| Header        |  Value        |
| ------------- |:-------------:|
| Content-Type  | application/json |
| Status Code   | 200 OK    |

Request body contains JSON with key bacteriumName:  
```
{
	bacteriumName: String
}
```  

Response body contains JSON that always has key correct that tells if given tests were correct answer and if they were correct it also has key completionImageUrl that has the url of the case's/game's completion image:  
```
{
	correct: false
}  
{  
	correct: true,
	completionImageUrl: String
}
```    
### Errors
`400 Bad Request`: if case with given id is not found.\
`401 Unauthorized`: with error message: "token missing or invalid" if current user is unauthorized. 
