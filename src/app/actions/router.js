import * as types from '../constants/ActionTypes'

export function transitionTo (route) {
  return { type: types.TRANSITION_TO, route }
}
