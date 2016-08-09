import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import cx from 'suitcx'
import * as TwitchActions from '../../actions/twitch'
import * as RouterActions from '../../actions/router'

import AccountsPanel from './settings/Accounts'
import ResetPanel from './settings/Reset'
import AboutPanel from './settings/About'

function SettingsPanel ({ accounts, channel, twitchActions, routerActions }) {
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
      <ResetPanel actions={twitchActions} />
      <AboutPanel actions={routerActions} />
    </div>
  )
}

function mapStateToProps ({ accounts, channel }, { purge }) {
  return { accounts, channel, purge }
}

function mapDispatchToProps (dispatch, { purge }) {
  return {
    twitchActions: {
      ...bindActionCreators(TwitchActions, dispatch),
      purgeStorage: () => purge()
    },
    routerActions: bindActionCreators(RouterActions, dispatch)
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SettingsPanel)
