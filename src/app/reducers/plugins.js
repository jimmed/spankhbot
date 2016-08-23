import { REHYDRATE } from 'redux-persist/constants'
import { PLUGIN_UPDATE, PLUGIN_EDIT_SETTING, PLUGIN_DELETE_SETTING } from '../constants/ActionTypes'
import { fromJS } from 'immutable'
import { getInitialState } from '../../plugins'

const initialState = fromJS(getInitialState())

export default function accounts (state = initialState, action) {
  switch (action.type) {
    case REHYDRATE:
      return rehydrate(state, action)
    case PLUGIN_UPDATE:
      return updatePlugin(state, action)
    case PLUGIN_EDIT_SETTING:
      return editSetting(state, action)
    case PLUGIN_DELETE_SETTING:
      return deleteSetting(state, action)
    default:
      return state
  }
}

function rehydrate (state, { payload: { plugins: incoming } }) {
  if (!incoming) {
    return state
  }
  return state.map((plugin, name) => plugin.merge(incoming.get([ name ], {})))
}

function updatePlugin (state, { payload: { plugin, name } }) {
  return state.update(name, (old) => old.merge(plugin))
}

function deleteSetting (state, { payload: { name, path } }) {
  return state.deleteIn([name, 'settings', ...path])
}

function editSetting (state, { payload: { name, path, value } }) {
  console.log(name, path, value)
  return state.setIn([name, 'settings', ...path], fromJS(value))
}

