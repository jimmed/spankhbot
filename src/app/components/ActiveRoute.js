import React from 'react'
import Error from './panels/Error'
import ChatPanel from './panels/Chat'
import SettingsPanel from './panels/Settings'
import AboutPanel from './panels/About'

function NotFoundError ({ route }) {
  const message = <span>The panel that you requested (<em>{route}</em>) does not exist!</span>
  return (
    <Error title='Oops!' message={message} severity='alert' />
  )
}

const panels = {
  chat: ChatPanel,
  settings: SettingsPanel,
  about: AboutPanel
}

export default function ActiveRoute ({ route, ...props }) {
  const [ mainRoute, ...childRoutes ] = route.split('/')
  const Route = panels[mainRoute] || NotFoundError
  return <Route route={route} {...props} />
}
