import { createStore, combineReducers, applyMiddleware } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension'
import thunk from 'redux-thunk'
import userReducer from './reducers/userReducer'
import bacteriaReducer from './reducers/bacteriaReducer'
import testReducer from './reducers/testReducer'
import caseReducer from './reducers/caseReducer'
import notificationReducer from './reducers/notificationReducer'
import gameReducer from './reducers/gameReducer'
import creditReducer from './reducers/creditReducer'

const reducer = combineReducers({
    user: userReducer,
    bacteria: bacteriaReducer,
    notification: notificationReducer,
    test: testReducer,
    case: caseReducer,
    game: gameReducer,
    credit: creditReducer
})

const store = createStore(reducer, composeWithDevTools(applyMiddleware(thunk)))

export default store