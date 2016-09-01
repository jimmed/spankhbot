import * as types from '../constants/ActionTypes'
import irc from 'slate-irc'
import net from 'net'
import { plugins, getStore } from '../../plugins'

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
      const handled = handleChatPlugins(message, 'onChatMessage')
      if (message) {
        embellish(dispatch, handled, accountType)
      }
    })
    client.pass(`oauth:${accessToken}`)
    client.nick(user)
    client.user(user, user)
    client.join(`#${channel}`)
    client.channel = channel
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

export function send (accountType, body) {
  return function (dispatch) {
    const client = clients[accountType]
    if (!client) {
      throw new Error('No IRC client open')
    }
    const channel = client.channel
    const sender = client.me
    client.send([`#${channel}`], body, function () {
      embellish(dispatch, { sender, body }, accountType)
    })
  }
}

function pluginSend (accountType, body) {
  return send(accountType, body)(getStore().dispatch)
}

function handleChatPlugins (message, fn) {
  const { plugins: state } = getStore().getState()

  if (!state) {
    return message
  }

  return Object.keys(plugins)
    .filter((key) => plugins[key][fn] && state.getIn([key, 'enabled']))
    .reduce((message, key) => {
      const settings = state.getIn([key, 'settings'])
      return plugins[key][fn]({ settings, message, respond: pluginSend }) || message
    }, message)
}

function parseMessage ({ command, params, prefix, string, trailing }) {
  const [ sender, hostname ] = prefix && prefix.split('!')
  switch (command) {
    case 'PRIVMSG':
      return { body: trailing, sender, hostname }
    case 'NOTICE':
      if (sender === 'tmi.twitch.tv' && trailing === 'Login authentication failed') {
        return { error: trailing }
      }
      break
    case 'RPL_WELCOME':
      return { body: trailing, sender: 'Twitch', hostname: sender }
    case 'JOIN':
      return { command, sender }
    case 'PONG':
      return { command, sender: 'Twitch' }
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

function embellish (dispatch, message, accountType) {
  if (!message) {
    return
  }

  if (message.error) {
    console.error(message)
    dispatch({
      type: types.CHAT_ERROR,
      error: message.error,
      accountType
    })
    dispatch({
      type: types.CHAT_DISCONNECT,
      accountType
    })
  }

  dispatch({
    type: types.CHAT_EVENT,
    date: Date.now(),
    message,
    accountType
  })
}
