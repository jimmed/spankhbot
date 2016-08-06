import { ipcRenderer as ipc } from 'electron'
import IPCSender from '../../lib/ipc/sender'

const AuthAPI = new IPCSender('twitch-auth')

export function authenticate () {
  return AuthAPI.send('login')
    .then(
      (data) => console.log(data),
      (error) => console.error(error)
    )
}
