import React from 'react'
import { findDOMNode } from 'react-dom'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import cx from '../../lib/suitcx'
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
                Chat for {account}
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
                  : accounts.hasIn([account, 'oAuth', 'accessToken']) && (
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
              {accounts.hasIn([account, 'oAuth', 'accessToken'])
                ? (
                  connecting
                    ? (
                      <button type='button' className='large hollow primary button loading'>
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

// TODO: Grouping
class ChatItemsList extends React.Component {
  render () {
    return (
      <div className='ChatItems-list' ref='items'>
        {this.props.messages.map((message, id) => (
          <div className={`${cx('Message')} row`} key={id}>
            <div className={`${cx('Message-sender')} small-2 columns text-right`}>
              <strong>{message.get('sender', 'IRC')}</strong>
            </div>
            <div className={`${cx('Message-body')} small-10 columns`}>
              <ChatItem message={message} />
            </div>
          </div>
        ))}
      </div>
    )
  }
}
ChatItemsList.propTypes = {
  message: React.PropTypes.any
}

function ChatItem ({ message }) {
  if (!message.has('sender')) {
    return (
      <p><code>{message.get('raw')}</code></p>
    )
  }

  return (
    <p>
      {message.has('command')
        ? (message.get('command') === 'JOIN' ? (<em>joined the channel</em>) : message.get('command'))
        : message.get('body')
      }
    </p>
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
