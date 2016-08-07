import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import Sidebar from './Sidebar'
import ActiveRoute from './ActiveRoute'
import * as RouterActions from '../actions/router'

function App ({ items, route, actions }) {
  return (
    <div>
      <Sidebar items={items} route={route} onClick={actions.transitionTo} />
      <ActiveRoute route={route} />
    </div>
  )
}

function mapStateToProps (state) {
  return {
    items: state.router.get('items'),
    route: state.router.get('route')
  }
}

function mapDispatchToProps (dispatch) {
  return {
    actions: bindActionCreators(RouterActions, dispatch)
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App)
