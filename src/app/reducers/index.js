import { combineReducers } from 'redux'
import router from './router'
import accounts from './accounts'
import channel from './channel'
import chat from './chat'
import plugins from './plugins'

const rootReducer = combineReducers({
  router,
  accounts,
  channel,
  chat,
  plugins
})

export default rootReducer
