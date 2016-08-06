import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import TwitchLogin from '../TwitchLogin'
import cx from '../../lib/suitcx'
import * as TwitchActions from '../../actions/twitch'

function LoginPanel ({ accounts, actions }) {
  return (
    <div className={cx('Panel')}>
      <div className='top-bar'>
        <div className='top-bar-left'>
          <div className='menu-text'>
            Login to Twitch
          </div>
        </div>
      </div>
      <div className={`callout info`}>
        <h5>No accounts</h5>
        <p>Please login to Twitch!</p>
        <p><TwitchLogin onClick={actions.twitchLogin} /></p>
      </div>
    </div>
  )
}

function mapStateToProps (state) {
  return {
    accounts: state.accounts,
  }
}

function mapDispatchToProps (dispatch) {
  return {
    actions: bindActionCreators(TwitchActions, dispatch)
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LoginPanel)
