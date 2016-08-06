const electron = require('electron')
const ipc = electron.ipcMain
const isPromise = electron.isPromise

module.exports = class IPCReceiver {
  constructor (channel, handlers = {}) {
    this.channel = channel
    this.handlers = handlers
    this.listener = this.receiveMessage.bind(this)
    ipc.on(this.channel, this.listener)
    console.info('IPCReceiver listening for', channel)
    debugger
  }

  removeListener () {
    ipc.removeListener(this.channel, this.listener)
  }

  receiveMessage (event, { id, command, params = {} }) {
    console.info('Received message', id, command, params)
    if (!id) {
      console.warn('Received message without ID')
    }
    if (!command) {
      console.error('Message', id, 'received without command')
      return
    }
    const handler = this.handlers[command]
    if (!handler) {
      console.error('Message', id, 'received with invalid command,', command)
      return
    }
    return Promise.resolve(handler(params))
      .then((data) => {
        console.log('Sending response', id, response)
        event.sender.send(this.channel, { id, response })
      })
  }
}
