## Front end

### Methods
The front end for Bakteerien tunnistuspeli is implemented using JavaScript and React.

### Architecture
The front end is roughly divided into three layers: component, state handling and service layer. [index.js](https://github.com/Ohtu-bakteerien-tunnistuspeli/Bakteerien-tunnistuspeli/blob/master/frontend/src/index.js) could be considered to be in fourth layer as it renders components, but there isn't much more to say about it.

#### [Component](https://github.com/Ohtu-bakteerien-tunnistuspeli/Bakteerien-tunnistuspeli/tree/master/frontend/src/components) layer
Components present views and data that is given by state handling layer and handle routing.   

Components can get data from state handling layer by using useSelector and modify state by using useDispatch and fuctions provided by state handling layer. For instance  
```
const bacteria = useSelector(state => state.bacteria)
```  
gets array of bacteria from state and  
```  
const dispatch = useDispatch()  
dispatch(addBacteria(newBacterium))  
```  
adds bacterium to state.  

Components also handle page routing which is mainly done in [App.js](https://github.com/Ohtu-bakteerien-tunnistuspeli/Bakteerien-tunnistuspeli/blob/master/frontend/src/App.js) using React Router. Components show views related to the current address in address bar. Address can be modified with React Router component Link and Redirect or by using useHistory which is mainly given to state handling layer so its functions can modify address. 

Components also do some data validation in their forms but validation is mainly done in back end which sends error message back if data was invalid. Error messages are given from service layer to state handling layer which changes notification state that is used by component layer to show messages.

#### [State handling](https://github.com/Ohtu-bakteerien-tunnistuspeli/Bakteerien-tunnistuspeli/tree/master/frontend/src/reducers) layer  
State handlig layer stores and modifies state and it consists of multiple reducers that handle designated state. All reducers are combined and given identifier in [store.js](https://github.com/Ohtu-bakteerien-tunnistuspeli/Bakteerien-tunnistuspeli/blob/master/frontend/src/store.js).  

Reducers provide asynchronous dispatch functions to component layer and they utilize service layer to receive/send data from/to back end. Reducers' functions handle error messages sent by back end and they are also used to modify address bar with history that is provided by component layer. For instance  
```  
export const login = (username, password, history) => {  
    return async dispatch => {  
        let user = await userService.login({ username, password })   
        dispatch({  
            type: 'LOGIN',  
            data: user  
        })  
        dispatch(setNotification( `You logged in successfully, ${username}`))  
        history.push('/bakteriumList')  
    }  
}  
```     
is login function without error handling. It is given strings "username" and "password" and object "history" that components get from ```const history = useHistory()```. The function uses userService that is on service layer to send and receive login information, modifies user state to store user and notification state to show message and then modifies address bar to show another view.

#### [Service](https://github.com/Ohtu-bakteerien-tunnistuspeli/Bakteerien-tunnistuspeli/tree/master/frontend/src/services) layer  
Service layer provides functions to state handling layer that use axios to send/receive data from/to back end. Service layer functions do not validate or modify data that is sent or received other than turning data that is to be sent into form data or received data to be just response's body. For instance, basic function to get data the service is designated to handle:  
```  
const get = (token) => {  
    const config = { headers: { Authorization: token } }  
    return axios.get(baseUrl, config).then(response => response.data).catch(error => error.response.data)  
}
```  






