const url = require('url')
const BrowserWindow = require('electron').BrowserWindow

const twitch = url.parse('https://api.twitch.tv/kraken')

const REDIRECT_URI = 'http://local.electron.app/'
const CLIENT_ID = 'n83jgvllpoatdvkr5tygp8kdil7x2k2'
const DEFAULT_SCOPE = [
  'user_read', // Read access to non-public user information, such as email address.
  'channel_read', // Read access to non-public channel information, including email address and stream key.
  'chat_login', // Ability to log into chat and send messages.
  'user_blocks_edit' // Ability to ignore or unignore on behalf of a user.
]

function generateTwitchUrl ({ api, query }) {
  return url.format({
    protocol: twitch.protocol,
    hostname: twitch.hostname,
    pathname: [twitch.pathname, api].join('/'),
    query
  })
}

function generateAuthorizeUrl ({ clientId, redirectUri, scope }) {
  return generateTwitchUrl({
    api: 'oauth2/authorize',
    query: {
      client_id: clientId,
      redirect_uri: redirectUri,
      scope: scope.join(' ')
    }
  })
}

module.exports = {
  generateTwitchUrl: generateTwitchUrl,
  generateAuthorizeUrl: generateAuthorizeUrl,

  authenticate (options) {
    console.log('Authenticate called', options)
    options = options || {}
    const scope = options.scope || DEFAULT_SCOPE
    const authUrl = generateAuthorizeUrl({ clientId: CLIENT_ID, redirectUri: REDIRECT_URI, scope })
    let authWindow = new BrowserWindow({
      width: 800,
      height: 600,
      show: false,
      'node-integration': false
    })
    authWindow.loadURL(authUrl)

    // Reset the authWindow on close
    authWindow.on('close', function() {
      authWindow = null
    }, false)

    return new Promise((resolve, reject) => {
      function handleRedirect () {
        const url = arguments[arguments.length - 1]
        console.log('Redirect!', url)
        const raw_code = /code=([^&]*)/.exec(url)
        const code = raw_code && raw_code.length > 1 && raw_code[1]
        const error = /\?error=(.+)$/.exec(url)

        if (code || error) {
          // Close the browser if code found or error
          authWindow.destroy()
          if (error) {
            reject(error)
          } else {
            resolve(code)
          }
        }
      }

      authWindow.webContents.on('will-navigate', (e, url) => handleRedirect(url))
      authWindow.webContents.on('did-get-redirect-request', (e, oldUrl, url) => handleRedirect(url))
      authWindow.show()
    })
      .then(function (code) {
        console.log(code)
        debugger
      })
      .catch(function (error) {
        console.error(error)
        debugger
      })
  }
}
