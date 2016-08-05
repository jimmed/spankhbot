import React from 'react'
import Sidebar from './Sidebar'
import ActiveRoute from './ActiveRoute'
import ChatPanel from './panels/Chat'

export default class App extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      route: 'chat'
    }
  }

  onSidebarClick (route, event) {
    this.setState({ route })
  }

  render () {
    return (
      <div>
        <Sidebar
          route={this.state.route}
          onClick={this.onSidebarClick.bind(this)}
        />
        <ActiveRoute route={this.state.route} />
      </div>
    )
  }
}
