import React from 'react'
import Error from './panels/Error'
import ChatPanel from './panels/Chat'
import SettingsPanel from './panels/Settings'
import ChatOrLoginPanel from './panels/ChatOrLogin'

function NotFoundError ({ route }) {
  const message = <span>The panel that you requested (<em>{route}</em>) does not exist!</span>
  return (
    <Error title='Oops!' message={message} severity='alert' />
  )
}

const panels = {
  chat: ChatOrLoginPanel,
  settings: SettingsPanel
}

export default function ActiveRoute ({ route }) {
  const Route = panels[route] || NotFoundError
  return <Route route={route} />
}
