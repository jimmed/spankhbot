import React from 'react';
import cx from 'suitcx';
import escapeRegexp from 'escape-string-regexp';

export const displayName = 'Auto-responder';

const blankPattern = {
  pattern: '!hithere',
  replacement: 'Welcome to the channel!',
  caseInsensitive: true
};

export class SettingsPane extends React.Component {
  onEdit(index, key, value) {
    this.props.actions.editSetting(
      this.props.name,
      ['patterns', index, key],
      value
    );
  }

  onDelete(index, key, value) {
    this.props.actions.deleteSetting(this.props.name, ['patterns', index]);
  }

  onAdd() {
    const nextIndex = this.props.settings.get('patterns').count();
    this.props.actions.editSetting(
      this.props.name,
      ['patterns', nextIndex],
      blankPattern
    );
  }

  render() {
    const { settings } = this.props;
    const canDelete =
      settings.has('patterns') && settings.get('patterns').count() > 1;
    return (
      <div className={cx('callout')}>
        <h3>Auto-responder</h3>
        <table>
          <thead>
            <tr>
              <th>When someone types...</th>
              <th colSpan={2}>...respond with</th>
            </tr>
          </thead>
          <tbody>
            {settings
              .get('patterns', [])
              .map((pattern, index) =>
                <PatternEditor
                  key={index}
                  pattern={pattern}
                  onEdit={this.onEdit.bind(this, index)}
                  onDelete={this.onDelete.bind(this, index)}
                  canDelete={canDelete}
                />
              )
              .toArray()}
          </tbody>
        </table>
        <button
          type="button"
          className="primary large button"
          onClick={this.onAdd.bind(this)}
        >
          Add another
        </button>
      </div>
    );
  }
}

class PatternEditor extends React.Component {
  onChange({ target: { name, value } }) {
    this.props.onEdit(name, value);
  }

  onToggle({ target: { name } }) {
    this.props.onEdit(name, !this.props.pattern.get(name));
  }

  render() {
    const { pattern, canDelete } = this.props;
    const patternValid = isValidPattern(pattern);
    return (
      <tr>
        <td>
          <div className="input-group">
            <input
              className={`input-group-field${patternValid ? '' : ' warning'}`}
              type="text"
              value={pattern.get('pattern', '')}
              onChange={this.onChange.bind(this)}
              name="pattern"
            />
            <div className="input-group-button">
              <button
                type="button"
                className={`button ${pattern.get('regex')
                  ? 'primary'
                  : 'secondary'}`}
                onClick={this.onToggle.bind(this)}
                name="regex"
              >
                .*
              </button>
              <button
                type="button"
                className={`button ${pattern.get('caseInsensitive')
                  ? 'primary'
                  : 'secondary'}`}
                onClick={this.onToggle.bind(this)}
                name="caseInsensitive"
              >
                Aa
              </button>
            </div>
          </div>
        </td>
        <td>
          <input
            type="text"
            value={pattern.get('replacement', '')}
            onChange={this.onChange.bind(this)}
            name="replacement"
          />
        </td>
        <td>
          <button
            type="button"
            className={`button ${pattern.get('enabled')
              ? 'success'
              : 'secondary'}`}
            onClick={this.onToggle.bind(this)}
            name="enabled"
          >
            {pattern.get('enabled') ? 'On' : 'Off'}
          </button>
          {canDelete &&
            <button
              type="button"
              className={`button secondary`}
              onClick={this.props.onDelete}
            >
              X
            </button>}
        </td>
      </tr>
    );
  }
}

function isValidPattern(pattern) {
  if (!pattern.get('regex')) {
    return true;
  }
  try {
    const test = new RegExp(pattern.get('pattern'));
    return true;
  } catch (error) {
    return false;
  }
}

export function getInitialSettings() {
  return {
    patterns: [
      {
        pattern: '!bumslap',
        replacement: 'SPORTY BUMSLAPS FOR ALL!'
      }
    ]
  };
}

export function onChatMessage({ settings, message, respond }) {
  if (!message || !message.body) {
    return;
  }

  settings.get('patterns').forEach(pattern => {
    const matcher = makeMatcher(pattern);
    if (matcher.exec(message.body)) {
      const body = message.body.replace(matcher, pattern.get('replacement'));
      respond('bot', body);
    }
  });
}

function makeMatcher(pattern) {
  const source = pattern.get('regex')
    ? pattern.get('pattern')
    : `^${escapeRegexp(pattern.get('pattern'))}`;
  const flags = pattern.get('caseInsensitive') ? 'i' : '';
  return new RegExp(source, flags);
}
