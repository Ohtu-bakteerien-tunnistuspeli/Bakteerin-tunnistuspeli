import { createStore, combineReducers, applyMiddleware } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension'
import thunk from 'redux-thunk'
import skeletonReducer from './reducers/skeletonReducer'
const reducer = combineReducers({ message: skeletonReducer })
const store = createStore(reducer, composeWithDevTools(applyMiddleware(thunk)))

export default store