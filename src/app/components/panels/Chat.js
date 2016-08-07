import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import cx from '../../lib/suitcx'
import * as ChatActions from '../../actions/chat'
import * as RouterActions from '../../actions/router'

export default function ChatPanel ({ accounts, channel, chat, routerActions, chatActions }) {
  const displayName = accounts.getIn(['streamer', 'profile', 'display_name'])
  const username = accounts.getIn(['streamer', 'profile', 'name'])
  const chatAccessToken = accounts.getIn(['streamer', 'oAuth', 'accessToken'])
  const onLogin = () => routerActions.transitionTo('settings')
  const onConnect = () => chatActions.connect(username, username, chatAccessToken)
  console.log(chat && chat.toJS())
  const connected = chat && chat.get('connected')
  const connecting = chat && chat.get('connecting')
  return (
    <div className={cx('Panel')}>
      <div className='top-bar'>
        <div className='top-bar-left'>
          <div className='menu-text'>
            Chat
          </div>
        </div>
      </div>
      {connected
        ? (
          <div className='ChatItems'>
            <div className='ChatItems-list'>
              {chat.get('messages').map((message, id) => <Message key={id} message={message} />)}
            </div>
          </div>
        )
        : (
          <div className='ChatDisconnected'>
            <p>{`You're offline :(`}</p>
            {channel
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
          <input className='input-group-field' type='text' placeholder={`Sending as ${displayName}`} />
          <a className='input-group-button button'>Send</a>
        </div>
      )}
    </div>
  )
}

function Message ({ message }) {
  const sender = message.get('sender')
  if (!sender) {
    return <pre>{message.get('raw')}</pre>
  }

  return (
    <div className='media-object'>
      <div className='media-object-section'>
        <h6>{sender}</h6>
        <p>{message.get('body')}</p>
      </div>
    </div>
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
