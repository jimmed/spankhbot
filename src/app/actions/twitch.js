import * as types from '../constants/ActionTypes'

function twitchApiCall (api, accessToken, params = {}) {
  const headers = new Headers({
    Authorization: `OAuth ${accessToken}`
  })

  return fetch(`https://api.twitch.tv/kraken/${api}`, { headers })
    .then((res) => res.json())
}

export function twitchLogin (type, accessToken, scope) {
  return function (dispatch) {
    dispatch({ type: types.LOGIN, accountType: type, accessToken, scope })

    return Promise.all([
      twitchApiCall('user', accessToken)
        .then((profile) => {
          dispatch({
            type: types.GET_ACCOUNT_DATA,
            accountType: type,
            profile,
          })
        }),
      twitchApiCall('channel', accessToken)
        .then((channel) => {
          dispatch({
            type: types.GET_CHANNEL_DATA,
            accountType: type,
            channel
          })
        })
    ])
  }
}

export function twitchLogout (accountType) {
  return { type: types.LOGOUT, accountType }
}
