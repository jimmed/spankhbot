import * as types from '../constants/ActionTypes'
import irc from 'slate-irc'
import net from 'net'

let client
export function connect (user, channel, accessToken) {
  return function (dispatch) {
    dispatch({ type: types.CHAT_CONNECTING })
    const params = {
      server: { address: 'irc.twitch.tv' },
      nick: user,
      password: `oauth:${accessToken}`
    }
    client = irc(net.connect({ port: 6667, host: 'irc.twitch.tv' }))
    client.on('welcome', () => dispatch({ type: types.CHAT_CONNECT }))
    // TODO: process more data here (create an event emitter that dispatch can be bound to)
    client.on('data', (message) => dispatch({ type: types.CHAT_MESSAGE, message }))
    client.pass(`oauth:${accessToken}`)
    client.nick(user)
    client.user(user, user)
    client.join(channel)
  }
}

export function chatDisconnect () {
  return function (dispatch) {
    if (client) {
      client.quit()
    }
    client = null
    dispatch({ type: types.CHAT_DISCONNECT })
  }
}
