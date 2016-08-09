import React from 'react'
import { findDOMNode } from 'react-dom'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import cx from 'suitcx'
import moment from 'moment'
import * as ChatActions from '../../actions/chat'
import * as RouterActions from '../../actions/router'

// TODO: Split this up too

export default class ChatPanel extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      message: '',
      account: 'streamer'
    }
  }

  componentDidUpdate () {
    this.scrollToBottom()
  }

  scrollToBottom () {
    const { items } = this.refs
    if (!items) {
      return
    }
    const itemsElement = findDOMNode(items)
    if (!itemsElement || !itemsElement.children.length) {
      return
    }
    const lastMessage = itemsElement.children[itemsElement.children.length - 1]
    lastMessage.scrollIntoViewIfNeeded(false)
  }

  onMessageEdit ({ target: { value } }) {
    this.setState({ message: value })
  }

  sendMessage (message) {
    const username = this.props.accounts.getIn(['streamer', 'profile', 'name'])
    const channel = this.props.channel.getIn(['name'])
    if (message) {
      this.props.chatActions.send('streamer', message, channel, username)
      this.setState({ message: '' })
    }
  }

  onMessageSend () {
    this.sendMessage(this.state.message)
  }

  onMessageKeyDown (event) {
    if (event.key === 'Enter') {
      this.sendMessage(event.target.value)
    }
  }

  onSwitchAccount (account) {
    this.setState({ account })
  }

  render () {
    const { accounts, channel, chat, routerActions, chatActions } = this.props
    const { message, account } = this.state
    const displayName = accounts.getIn([account, 'profile', 'display_name'])
    const username = accounts.getIn([account, 'profile', 'name'])
    const chatAccessToken = accounts.getIn([account, 'oAuth', 'accessToken'])
    const onLogin = () => routerActions.transitionTo('settings')
    const onConnect = () => {
      chatActions.connect(account, username, channel.get('name'), chatAccessToken)
    }
    const activeChat = chat && chat.get(account)
    const connected = activeChat && activeChat.get('connected')
    const connecting = activeChat && activeChat.get('connecting')

    const otherAccount = account === 'streamer' ? 'bot' : 'streamer'
    const switchAccounts = () => this.setState({ account: otherAccount })

    return (
      <div className={cx('Panel')}>
        <div className='top-bar'>
          <div className='top-bar-left'>
            <ul className='menu'>
              <li className='menu-text'>
                Chat ({account} account)
              </li>
            </ul>
          </div>
          <div className='top-bar-right'>
            <ul className='menu' style={{fontWeight: 'normal'}}>
              <li>
                <button type='button' onClick={switchAccounts} className={'small hollow button'}>
                  Switch to {otherAccount} account
                </button>
              </li>
              {connected
                ? (
                  <li>
                    <button type='button' onClick={() => chatActions.disconnect(account)} className={'small secondary hollow button'}>
                      Disconnect
                    </button>
                  </li>
                )
                : (connecting
                  ? (
                    <li>
                      <button type='button' className={'small primary hollow button'}>
                        Connecting&hellip;
                      </button>
                    </li>
                  )
                  : accounts.hasIn([account, 'oAuth', 'accessToken']) && channel && (
                    <li>
                      <button type='button' onClick={onConnect} className={'small primary button'}>
                        Connect
                      </button>
                    </li>
                  )
                )
              }
            </ul>
          </div>
        </div>
        {connected
          ? (
            <div className='ChatItems'>
              <ChatItemsList messages={activeChat.get('messages')} ref='items' />
            </div>
          )
          : (
            <div className='ChatDisconnected'>
              {accounts.hasIn([account, 'oAuth', 'accessToken']) && channel
                ? (
                  connecting
                    ? (
                      <button type='button' className='large hollow primary button'>
                        Connecting to <strong>#{channel.get('display_name')}</strong>&hellip;
                      </button>
                    )
                    : (
                      <button type='button' className='large primary button' onClick={onConnect}>
                        Connect to <strong>#{channel.get('display_name')}</strong>
                      </button>
                    )
                )
                : (
                  <button type='button' className='large primary button' onClick={onLogin}>
                    Login via <strong>Twitch</strong>
                  </button>
                )}
            </div>
          )
        }
        {connected && (
          <div className='input-group ChatBox'>
            <input
              className='input-group-field'
              type='text'
              placeholder={`Sending as ${displayName}`}
              value={message}
              onChange={this.onMessageEdit.bind(this)}
              onKeyDown={this.onMessageKeyDown.bind(this)}
            />
            <a
              className='input-group-button button'
              onClick={this.onMessageSend.bind(this)}
            >
              Send
            </a>
          </div>
        )}
      </div>
    )
  }
}

ChatPanel.propTypes = {
  accounts: React.PropTypes.any,
  channel: React.PropTypes.any,
  chat: React.PropTypes.any,
  routerActions: React.PropTypes.any,
  chatActions: React.PropTypes.any
}

class ChatItemsList extends React.Component {
  groupMessagesByTime (messages) {
    let prevSender, prevTimestamp
    return messages.reduce((groups, message) => {
      const isSameSender = prevSender && prevSender === message.get('sender')
      const isRecentEnough = prevTimestamp && message.get('date') - prevTimestamp < 30000
      if (!isSameSender || !isRecentEnough) {
        groups.push({ messages: [message], sender: message.get('sender') })
      } else {
        groups[groups.length - 1].messages.push(message)
      }
      prevSender = message.get('sender')
      prevTimestamp = message.get('date')
      groups[groups.length - 1].date = prevTimestamp
      return groups
    }, [])
  }

  render () {
    const { messages } = this.props
    return (
      <div className='ChatItems-list' ref='items'>
        {messages.count() === 1000 && (
          <div className={`${cx('Message', { scrollbackLimit: true })} row`}>
            <div className={`${cx('Message-body')} small-12 columns`}>
              {`You've hit the scrollback limit! This is currently limited to 1000 messages, but will be configurable later!`}
            </div>
          </div>
        )}
        {this.groupMessagesByTime(messages)
          .map(({ messages, sender, date }, id) => (
            <div className={`${cx('Message')} row`} key={id}>
              <div className={`${cx('Message-sender')} small-2 columns text-right`}>
                <strong>{sender}</strong>
              </div>
              <div className={`${cx('Message-body')} small-10 columns`}>
                <ChatItemGroup messages={messages} date={date} />
              </div>
            </div>
          ))
        }
      </div>
    )
  }
}
ChatItemsList.propTypes = {
  messages: React.PropTypes.any
}

function ChatItemGroup ({ messages, date }) {
  return (
    <p>
      {messages.reduce((memo, message, i) => {
        if (i) memo.push(<br key={i * 2 + 1} />)
        memo.push(<ChatItem message={message} key={i * 2} />)
        return memo
      }, [])}
      <div className={`${cx('Message-date')} top float-right`}>
        <small>{moment(date).fromNow()}</small>
      </div>
    </p>
  )
}

// To be replaced by a core plugin ('probably "IRC info"')
const chatCommands = {
  JOIN: () => <em>joined the channel</em>,
  PONG: () => <em>Pong!</em>,
  ACTION: (message) => {
    return (<em>{message.get('trailing')}</em>)
  }
}

function ChatItem ({ message }) {
  if (!message.has('sender')) {
    return (
      <code>{message.get('raw')}</code>
    )
  }

  if (message.has('command')) {
    const generator = chatCommands[message.get('command')]
    if (generator) {
      return generator(message)
    }
  }

  return (
    <span>{message.get('body')}</span>
  )
}

function mapStateToProps ({ accounts, channel, chat }) {
  return { accounts, channel, chat }
}

function mapDispatchToProps (dispatch) {
  return {
    routerActions: bindActionCreators(RouterActions, dispatch),
    chatActions: bindActionCreators(ChatActions, dispatch)
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ChatPanel)
