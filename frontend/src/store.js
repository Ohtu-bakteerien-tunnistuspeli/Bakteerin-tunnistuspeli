import { createStore, combineReducers, applyMiddleware } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension'
import thunk from 'redux-thunk'
import skeletonReducer from './reducers/skeletonReducer'
import userReducer from './reducers/userReducer'
import bacteriaReducer from './reducers/bacteriaReducer'
import testReducer from './reducers/testReducer'
import caseReducer from './reducers/caseReducer'
import notificationReducer from './reducers/notificationReducer'
const reducer = combineReducers({ message: skeletonReducer, user: userReducer, bacteria: bacteriaReducer, notification: notificationReducer, test: testReducer, case: caseReducer })

const store = createStore(reducer, composeWithDevTools(applyMiddleware(thunk)))

export default store