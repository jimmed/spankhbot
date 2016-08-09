import { REHYDRATE } from 'redux-persist/constants'
import { LOGOUT, GET_CHANNEL_DATA } from '../constants/ActionTypes'
import { fromJS } from 'immutable'

const initialState = null

export default function channel (state = initialState, action) {
  switch (action.type) {
    case REHYDRATE:
      return rehydrate(state, action)
    case LOGOUT:
      return initialState
    case GET_CHANNEL_DATA:
      return setChannelData(state, action)
    default:
      return state
  }
}

function rehydrate (state, { payload: { channel } }) {
  return channel ? (state ? state.merge(channel) : channel) : state
}

function setChannelData (state, { accountType, channel }) {
  if (accountType !== 'streamer') {
    return state
  }
  return fromJS(channel)
}
