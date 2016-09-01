import { TRANSITION_TO } from '../constants/ActionTypes'
import { fromJS } from 'immutable'

const initialState = fromJS({
  items: [
    { text: 'Chat', route: 'chat', icon: 'chat' },
    { text: 'Settings', route: 'settings', icon: 'settings', align: 'bottom' }
  ],
  route: 'chat'
})

export default function router (state = initialState, action) {
  switch (action.type) {
    case TRANSITION_TO:
      return initialState.set('route', action.route)
    default:
      return state
  }
}
