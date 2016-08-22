import React from 'react'
import { parse, format } from 'url'
import { parse as querystring } from 'querystring'

const REDIRECT_URI = 'http://localhost'
const CLIENT_ID = 'n83jgvllpoatdvkr5tygp8kdil7x2k2'

const DEFAULT_SCOPE = [
  'user_read', // Read access to non-public user information, such as email address.
  'channel_read', // Read access to non-public channel information, including email and stream key.
  'chat_login', // Ability to log into chat and send messages.
  'user_blocks_edit' // Ability to ignore or unignore on behalf of a user.
]

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

export default class AccountsPanel extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      loggingIn: null
    }
  }

  onLoginStart (accountType) {
    this.setState({ loggingIn: accountType })
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
        <LoginWebview
          account={this.state.loggingIn}
          onLoginDone={this.onLoginDone.bind(this)}
          onLoginCancelled={this.onLoginCancelled.bind(this)}
        />
      </div>
    )
  }
}

AccountsPanel.propTypes = {
  accounts: React.PropTypes.any,
  actions: React.PropTypes.any
}

class LoginWebview extends React.Component {
  componentDidMount () {
    const { webview } = this.refs
    this.domListener = () => {
      const { hostname, hash, query } = parse(webview.getURL(), true, true)
      if (hostname !== 'localhost') {
        return
      }
      if (query && query.error && query.error === 'access_denied') {
        return this.props.onLoginCancelled()
      }
      const { access_token: token, scope } = querystring(hash.slice(1))
      this.props.onLoginDone(token, scope)
    }
    webview.addEventListener('dom-ready', this.domListener)
    webview.partition = `login:${this.props.account}`
    webview.src = AUTH_URL
  }

  componentWillUnmount () {
    this.refs.webview.removeEventListener('dom-ready', this.domListener)
    this.domListener = null
  }

  render () {
    return (
      <webview ref='webview' style={{height: 550}} />
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

Account.propTypes = {
  actions: React.PropTypes.any
}
