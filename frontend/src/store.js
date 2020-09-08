import { createStore, combineReducers, applyMiddleware } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension'
import thunk from 'redux-thunk'
import skeletonReducer from './reducers/skeletonReducer'
import userReducer from './reducers/userReducer'
const reducer = combineReducers({ message: skeletonReducer, user: userReducer })
const store = createStore(reducer, composeWithDevTools(applyMiddleware(thunk)))

export default store