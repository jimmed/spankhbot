import { authenticate } from '../api/auth'
import * as types from '../constants/ActionTypes'

export function twitchLogin (type, accessToken, scope) {
  return function (dispatch) {
    dispatch({ type: types.LOGIN, accountType: type, accessToken, scope })

    const headers = new Headers({
      Authorization: `OAuth ${accessToken}`
    })

    return fetch(`https://api.twitch.tv/kraken/user`, { headers })
      .then((res) => res.json())
      .then((profile) => dispatch({ type: types.GET_ACCOUNT_DATA, accountType: type, profile, accessToken }))
  }
}

export function twitchLogout (accountType) {
  return { type: types.LOGOUT, accountType }
}
