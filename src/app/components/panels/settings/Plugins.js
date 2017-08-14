import React from 'react';
import ExternalLink from '../../ExternalLink';
import { fromJS } from 'immutable';

export default function PluginsPanel(props) {
  return (
    <div className="callout">
      <h5>Plugins</h5>
      <p>
        This is where the magic happens. Plugins make Spankhbot more than just
        an IRC client.
      </p>
      <PluginList {...props} />
    </div>
  );
}

function PluginList({ plugins, actions }) {
  return (
    <table className="table">
      <thead>
        <tr>
          <th>Plugin</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {plugins
          .map((plugin, key) =>
            <PluginListItem plugin={plugin} key={key} actions={actions} />
          )
          .toArray()}
      </tbody>
    </table>
  );
}

class PluginListItem extends React.Component {
  toggleActive() {
    const { plugin } = this.props;
    this.props.actions.setEnabled(plugin.get('name'), !plugin.get('enabled'));
  }

  openSettings() {
    const { plugin } = this.props;
    this.props.actions.openSettingsPanel(plugin.get('name'));
  }

  render() {
    const { plugin } = this.props;
    return (
      <tr>
        <td>
          {plugin.get('displayName')}
        </td>
        <td>
          <button
            type="button"
            onClick={this.toggleActive.bind(this)}
            className={`button ${plugin.get('enabled')
              ? 'success active'
              : 'secondary'}`}
          >
            {plugin.get('enabled') ? 'On' : 'Off'}
          </button>
          <button
            type="button"
            onClick={this.openSettings.bind(this)}
            className={`button primary hollow`}
          >
            Settings
          </button>
        </td>
      </tr>
    );
  }
}
