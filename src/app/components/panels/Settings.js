import React from 'react'
import { parse, format } from 'url'
import { parse as querystring } from 'querystring'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import cx from '../../lib/suitcx'
import * as TwitchActions from '../../actions/twitch'

const REDIRECT_URI = 'http://localhost'
const CLIENT_ID = 'n83jgvllpoatdvkr5tygp8kdil7x2k2'
const DEFAULT_SCOPE = [
  'user_read', // Read access to non-public user information, such as email address.
  'channel_read', // Read access to non-public channel information, including email and stream key.
  'chat_login', // Ability to log into chat and send messages.
  'user_blocks_edit' // Ability to ignore or unignore on behalf of a user.
]

function SettingsPanel ({ accounts, actions }) {
  return (
    <div className={cx('Panel')}>
      <div className='top-bar'>
        <div className='top-bar-left'>
          <div className='menu-text'>
            Settings
          </div>
        </div>
      </div>
      <AccountsPanel accounts={accounts} actions={actions} />
    </div>
  )
}

const AUTH_URL = format({
  protocol: 'https',
  hostname: 'api.twitch.tv',
  pathname: 'kraken/oauth2/authorize',
  query: {
    response_type: 'token',
    client_id: CLIENT_ID,
    redirect_uri: REDIRECT_URI,
    scope: DEFAULT_SCOPE.join(' '),
    force_verify: true
  }
})

class AccountsPanel extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      loggingIn: null
    }
  }

  onLoginStart (accountType) {
    this.setState({ loggingIn: accountType })
  }

  componentDidUpdate (props, { loggingIn: wasLoggingIn }) {
    if (!this.state.loggingIn || wasLoggingIn) {
      return
    }

    const { webview } = this.refs
    webview.addEventListener('dom-ready', () => {
      const { hostname, hash, query } = parse(webview.getURL(), true, true)
      if (hostname !== 'localhost') {
        return
      }
      if (query && query.error && query.error === 'access_denied') {
        return this.onLoginCancelled()
      }
      const { access_token: token, scope } = querystring(hash.slice(1))
      this.onLoginDone(token, scope)
    })
  }

  onLoginCancelled () {
    this.setState({ loggingIn: null })
  }

  onLoginDone (token, scope) {
    this.props.actions.twitchLogin(this.state.loggingIn, token, scope)
    this.setState({ loggingIn: null })
  }

  onLogout (accountType) {
    this.props.actions.twitchLogout(accountType)
  }

  render () {
    const { accounts } = this.props
    const { loggingIn } = this.state
    if (!loggingIn) {
      return (
        <div className='callout'>
          <h5>Twitch Accounts</h5>
          <p>
            {`You may configure two Twitch accounts - one for your stream and one for your bot.`}
          </p>
          <table>
            <tbody>
              <tr>
                <th>
                  Streamer
                </th>
                <td>
                  <Account
                    onLoginStart={this.onLoginStart.bind(this, 'streamer')}
                    onLogout={this.onLogout.bind(this, 'streamer')}
                    account={accounts.get('streamer')}
                  />
                </td>
              </tr>
              <tr>
                <th>
                  Bot
                </th>
                <td>
                  <Account
                    onLoginStart={this.onLoginStart.bind(this, 'bot')}
                    onLogout={this.onLogout.bind(this, 'bot')}
                    account={accounts.get('bot')}
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      )
    }

    return (
      <div className='callout'>
        <h5>Login {loggingIn} Twitch account</h5>
        <webview ref='webview' src={AUTH_URL} style={{height: 550}} />
      </div>
    )
  }
}

function Account ({ actions, account, onLoginStart, onLogout }) {
  if (!account) {
    return (
      <img
        src='http://ttv-api.s3.amazonaws.com/assets/connect_dark.png'
        alt='Connect with Twitch'
        onClick={onLoginStart}
        style={{cursor: 'pointer'}} />
    )
  }

  if (!account.has('profile')) {
    return (
      <span>Fetching profile data...</span>
    )
  }

  return (
    <span>
      <button type='button' onClick={onLogout} className='button'>
        Logout <strong>{account.getIn(['profile', 'display_name'], 'Unknown')}</strong>
      </button>
    </span>
  )
}

function mapStateToProps ({ accounts }) {
  return { accounts }
}

function mapDispatchToProps (dispatch) {
  return {
    actions: bindActionCreators(TwitchActions, dispatch)
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SettingsPanel)
