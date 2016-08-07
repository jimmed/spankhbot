import { combineReducers } from 'redux'
import router from './router'
import accounts from './accounts'
import channel from './channel'
import chat from './chat'

const rootReducer = combineReducers({
  router,
  accounts,
  channel,
  chat
})

export default rootReducer
