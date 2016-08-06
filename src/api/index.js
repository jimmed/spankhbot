const IPCReceiver = require('../lib/ipc/receiver')
const authenticate = require('./twitch').authenticate

module.exports = {
  twitch: new IPCReceiver('twitch-auth', {
    login: authenticate
  })
}
