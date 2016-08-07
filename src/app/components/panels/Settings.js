import React from 'react'
import { parse, format } from 'url'
import { parse as querystring } from 'querystring'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import cx from '../../lib/suitcx'
import * as TwitchActions from '../../actions/twitch'

// TODO: The big split up. Boy will that be satisfying, shaving that yak

const REDIRECT_URI = 'http://localhost'
const CLIENT_ID = 'n83jgvllpoatdvkr5tygp8kdil7x2k2'
const DEFAULT_SCOPE = [
  'user_read', // Read access to non-public user information, such as email address.
  'channel_read', // Read access to non-public channel information, including email and stream key.
  'chat_login', // Ability to log into chat and send messages.
  'user_blocks_edit' // Ability to ignore or unignore on behalf of a user.
]

function SettingsPanel ({ accounts, channel, actions }) {
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

const accountTypes = {
  streamer: 'Streamer',
  bot: 'Bot'
}

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
            {`You may configure two Twitch accounts - one for your stream and one for your bot. These, unfortunately, cannot be the same account.`}
          </p>
          <form>
            {Object.keys(accountTypes).map((accountType) => (
              <div className='row' key={accountType}>
                <div className='small-3 columns'>
                  <label className='text-right middle'>
                    <strong>{accountTypes[accountType]}</strong>
                  </label>
                </div>
                <div className='small-9 columns'>
                  <Account
                    onLoginStart={this.onLoginStart.bind(this, accountType)}
                    onLogout={this.onLogout.bind(this, accountType)}
                    account={accounts.get(accountType)}
                  />
                </div>
              </div>
            ))}
          </form>
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
      <button type='button' className='hollow primary button' onClick={onLoginStart}>
        Login via <strong>Twitch</strong>
      </button>
    )
  }

  if (!account.has('profile')) {
    return (
      <button type='button' className='hollow primary button disabled'>
        Fetching profile&hellip;
      </button>
    )
  }

  return (
    <button type='button' onClick={onLogout} className='primary button'>
      Logout <strong>{account.getIn(['profile', 'display_name'], 'Unknown')}</strong>
    </button>
  )
}

function mapStateToProps ({ accounts, channel }) {
  return { accounts, channel }
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
