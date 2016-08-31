import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import cx from 'suitcx'

import * as TwitchActions from '../../actions/twitch'
import * as RouterActions from '../../actions/router'
import * as PluginActions from '../../actions/plugins'

import AccountsPanel from './settings/Accounts'
import ResetPanel from './settings/Reset'
import AboutPanel from './settings/About'
import PluginsPanel from './settings/Plugins'
import PluginPanel from './settings/Plugin'

function SettingsPanelRouter ({ route, plugins, pluginActions, ...props }) {
  const [ , childRoute ] = route.split('/')
  if (childRoute) {
    const [ type, pluginName ] = childRoute.split(':')
    if (type === 'plugin') {
      return (
        <PluginPanel
          name={pluginName}
          settings={plugins.getIn([pluginName, 'settings'])}
          actions={pluginActions}
        />
      )
    }
  }
  return <SettingsPanel plugins={plugins} pluginActions={pluginActions} {...props} />
}

function SettingsPanel ({ accounts, channel, plugins, twitchActions, routerActions, pluginActions }) {
  return (
    <div className={cx('Panel')}>
      <div className='top-bar'>
        <div className='top-bar-left'>
          <div className='menu-text'>
            Settings
          </div>
        </div>
      </div>
      <AccountsPanel accounts={accounts} actions={twitchActions} />
      <PluginsPanel plugins={plugins} actions={pluginActions} />
      <ResetPanel actions={twitchActions} />
      <AboutPanel actions={routerActions} />
    </div>
  )
}

function mapStateToProps ({ accounts, channel, plugins }, { purge, route }) {
  return { accounts, channel, plugins, purge, route }
}

function mapDispatchToProps (dispatch, { purge }) {
  return {
    twitchActions: {
      ...bindActionCreators(TwitchActions, dispatch),
      purgeStorage: () => purge()
    },
    routerActions: bindActionCreators(RouterActions, dispatch),
    pluginActions: bindActionCreators(PluginActions, dispatch)
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SettingsPanelRouter)
