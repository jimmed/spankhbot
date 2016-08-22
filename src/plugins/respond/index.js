import React from 'react'
import cx from 'suitcx'
import escapeRegexp from 'escape-string-regexp'

export class SettingsPane extends React.Component {
  onEdit (index, key, value) {
    this.props.actions.editSetting(['patterns', index, key], value)
  }

  onDelete (index, key, value) {
    this.props.actions.deleteSetting(['patterns', index])
  }

  render () {
    return (
      <div className={cx('Panel')}>
        <h3>Respond</h3>
        <table>
          <thead>
            <tr><th>When someone types...</th><th>...respond with</th></tr>
          </thead>
          <tbody>
            {settings.get('patterns').map((pattern, index) => (
              <PatternEditor
                pattern={pattern}
                onEdit={this.onEdit.bind(this, index)}
                onDelete={this.onDelete.bind(this, index)}
              />
            ).toArray()}
          </tbody>
        </table>
      </div>
    )
  }
}

class PatternEditor extends React.Component {
  onChange ({ target: { name, value } }) {
    this.props.onEdit(name, value)
  }

  onToggle ({ target: { name } }) {
    this.props.onEdit(name, !this.props.pattern.get(name))
  }

  render () {
    const { pattern } = this.props
    return (
      <tr>
        <td className='input-group'>
          <input className='input-group-field' type='text' value={pattern.get('pattern', '')} onChange={this.onChange.bind(this)} name='pattern' />
          <div className='input-group-button'>
            <button type='button' className={`button secondary${pattern.get('regex') ? ' active' : ''}`} onClick={this.onToggle.bind(this)} name='regex'>.*</button>
            <button type='button' className={`button secondary${pattern.get('caseInsensitive') ? ' active' : ''}`} onClick={this.onToggle.bind(this)} name='caseInsensitive'>Aa</button>
          </div>
        </td>
        <td className='input-group'>
          <input className='input-group-field' type='text' value={pattern.get('replacement', '')} onChange={this.onChange.bind(this)} name='replacement' />
        </td>
        <td className='input-group'>
          <button type='button' className={`button secondary`} onClick={this.props.onDelete}>X</button>
        </td>
      </tr>
    )
  }
}

export function onInstall ({ actions }) {
  actions.editSetting(['patterns'], [])
}

export function onChatMessage ({ settings, message, actions }) {
  settings.get('patterns').forEach((pattern) => {
    if (makeMatcher(pattern).exec(message.body)) {
      actions.chatSend('bot', pattern.get('replacement'))
    }
  })
}

function makeMatcher (pattern) {
  const source = pattern.get('regex') ? pattern.get('pattern') : `^${escapeRegexp(pattern.get('pattern'))}`
  const flags = pattern.get('caseInsensitive') ? 'i' : ''
  return new RegExp(source, flags)
}
