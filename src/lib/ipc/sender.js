import { ipcRenderer as ipc } from 'electron';

export default class IPCSender {
  constructor(channel) {
    this.channel = channel;
    this.callbacks = {};
    this.lastId = 0;
    this.listener = this.receive.bind(this);
  }

  removeAllListeners() {
    ipc.removeListener(this.channel, listener);
    Object.keys(this.callbacks).forEach(this.removeListener, this);
  }

  removeListener(id) {
    ipc.removeListener(this.callbacks[id]);
    delete this.callbacks[id];
  }

  receive(event, { id, response }) {
    console.info('Received response', id, response);
    if (!id) {
      console.warn('Received response with no ID');
    }
    if (!this.callbacks[id]) {
      console.warn('Received response for invalid callback', id);
    }
    this.callbacks[id](response);
  }

  send(command, params = {}) {
    const id = ++this.lastId;
    return new Promise((resolve, reject) => {
      this.callbacks[id] = resolve;
      console.info('Sending', id, command, params);
      ipc.send(this.channel, { id, command, params });
    }).then(
      data => {
        this.removeListener(id);
        return data;
      },
      error => {
        this.removeListener(id);
        throw error;
      }
    );
  }
}
