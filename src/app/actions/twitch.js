import { authenticate } from '../api/auth'
import * as types from '../constants/ActionTypes'

export function twitchLogin () {
  return function (dispatch) {
    return authenticate()
      .then(function (code) {
        dispatch({ type: types.TWITCH_LOGIN, code })
      })
  }
}
