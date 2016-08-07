import * as types from '../constants/ActionTypes'
import irc from 'slate-irc'
import net from 'net'

const clients = {}
export function connect (accountType, user, channel, accessToken) {
  return function (dispatch) {
    if (clients[accountType]) {
      console.info(accountType, 'already connected')
      return
    }
    dispatch({ type: types.CHAT_CONNECTING, accountType })
    const client = clients[accountType] = irc(net.connect({ port: 6667, host: 'irc.twitch.tv' }))
    client.on('welcome', () => dispatch({ type: types.CHAT_CONNECT, accountType }))
    client.on('data', (rawMessage) => {
      const message = parseMessage(rawMessage)
      if (message) {
        dispatch(embellish(message, accountType))
      }
    })
    client.pass(`oauth:${accessToken}`)
    client.nick(user)
    client.user(user, user)
    client.join(channel)
  }
}

export function disconnect (accountType) {
  return function (dispatch) {
    const client = clients[accountType]
    if (client) {
      client.quit()
    }
    delete clients[accountType]
    dispatch({ type: types.CHAT_DISCONNECT, accountType })
  }
}

export function send (accountType, body, channel, sender) {
  return function (dispatch) {
    const client = clients[accountType]
    if (!client) {
      throw new Error('No IRC client open')
    }
    client.send([`#${channel}`], body, function () {
      dispatch({ type: types.CHAT_SEND, accountType, message: { sender, body } })
    })
  }
}

function parseMessage ({ command, params, prefix, string, trailing }) {
  const [ sender, hostname ] = prefix && prefix.split('!')
  switch (command) {
    case 'PRIVMSG':
      return { body: trailing, sender, hostname }
    case 'RPL_WELCOME':
      return { body: trailing, sender: 'Twitch', hostname: sender }
    case 'JOIN':
      return { command, sender }
    case 'RPL_YOURHOST':
    case 'RPL_CREATED':
    case 'RPL_MYINFO':
    case 'RPL_MOTDSTART':
    case 'RPL_MOTD':
    case 'RPL_ENDOFMOTD':
    case 'RPL_NAMREPLY':
    case 'RPL_ENDOFNAMES':
      return
    default:
      return { raw: string, command, params, prefix, string, trailing }
  }
}

function embellish (message, accountType) {
  console.log(message)
  return {
    type: types.CHAT_EVENT,
    date: Date.now(),
    message,
    accountType
  }
}
