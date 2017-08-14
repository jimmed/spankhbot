import * as types from '../constants/ActionTypes';
import { plugins } from '../../plugins';

export function setEnabled(name, enabled) {
  if (enabled && plugins[name].onEnabled) {
    plugins[name].onEnabled();
  }
  if (!enabled && plugins[name].onDisabled) {
    plugins[name].onDisabled();
  }
  return { type: types.PLUGIN_UPDATE, payload: { name, plugin: { enabled } } };
}

export function openSettingsPanel(name) {
  return { type: types.TRANSITION_TO, route: `settings/plugin:${name}` };
}

export function editSetting(name, path, value) {
  return { type: types.PLUGIN_EDIT_SETTING, payload: { name, path, value } };
}

export function deleteSetting(name, path) {
  return { type: types.PLUGIN_DELETE_SETTING, payload: { name, path } };
}
