import { REHYDRATE } from 'redux-persist/constants'
import { LOGIN, LOGOUT, GET_ACCOUNT_DATA } from '../constants/ActionTypes'
import { fromJS } from 'immutable'

const initialState = fromJS({})

export default function accounts (state = initialState, action) {
  switch (action.type) {
    case REHYDRATE:
      const incoming = action.payload.accounts
      return incoming ? state.merge(incoming) : state
    case LOGIN:
      return addEmptyAccount(state, action)
    case LOGOUT:
      return deleteAccount(state, action)
    case GET_ACCOUNT_DATA:
      return addUserDataToAccount(state, action)
    default:
      return state
  }
}

function addEmptyAccount (state, { accountType, accessToken, scope }) {
  return state.set(accountType, fromJS({ oAuth: { accessToken, scope } }))
}

function addUserDataToAccount (state, { accountType, profile }) {
  return state.update(accountType, (user) => user.set('profile', fromJS(profile)))
}

function deleteAccount (state, { accountType }) {
  return state.remove(accountType)
}
