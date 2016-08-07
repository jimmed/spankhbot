import { CHAT_CONNECT, CHAT_CONNECTING, CHAT_DISCONNECT, CHAT_MESSAGE } from '../constants/ActionTypes'
import { fromJS } from 'immutable'

const initialState = fromJS({
  messages: []
})

export default function accounts (state = initialState, action) {
  switch (action.type) {
    case CHAT_CONNECTING:
      return state.delete('connected').set('connecting', true)
    case CHAT_CONNECT:
      return state.delete('connecting').set('connected', true)
    case CHAT_DISCONNECT:
      return state.delete('connecting').delete('connected')
    case CHAT_MESSAGE:
      return addMessage(state, action)
    default:
      return state
  }
}

function addMessage (state, { message }) {
  switch (message.command) {
    case 'RPL_YOURHOST':
      return state.set('host', message.prefix)
    case 'PONG':
      return state.set('lastPing', Number(message.trailing))
    default:
      return state.update('messages', (messages) => messages.push(fromJS(parseMessage(message))))
  }
}

function parseMessage ({ command, params, prefix, string, trailing }) {
  switch (true) {
    case command === 'RPL_WELCOME':
      return { sender: 'server', body: trailing, raw: string }
    default:
      return { raw: string }
  }
}
