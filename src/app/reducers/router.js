import { TRANSITION_TO } from '../constants/ActionTypes'
import { fromJS } from 'immutable'

const initialState = fromJS({
  items: [
    { text: 'Chat', route: 'chat' },
    { text: 'Settings', route: 'settings', align: 'bottom' }
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
