import React from 'react'
import ExternalLink from '../../ExternalLink'
import { fromJS } from 'immutable'
import { plugins } from '../../../../plugins'

export default function PluginPanel ({ name, actions, settings }) {
  const Panel = plugins[name].SettingsPane
  return (
    <Panel name={name} actions={actions} settings={settings} />
  )
}
