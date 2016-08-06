import { combineReducers } from 'redux'
import router from './router'
import accounts from './accounts'

const rootReducer = combineReducers({
  router,
  accounts
})

export default rootReducer
