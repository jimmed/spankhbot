import React from 'react'
import cx from 'suitcx'
import escapeRegexp from 'escape-string-regexp'

let responder
// TODO: Allow enabling/disabling without reconnecting

export const displayName = 'Timed announcements'

const blankAnnouncement = {
  announcement: 'This message brought to you by spankhbot!',
  timer: { unit: 'm', quantity: 30 }
}

export class SettingsPane extends React.Component {
  onEdit (index, key, value) {
    const keyPath = key.split('.')
    this.props.actions.editSetting(this.props.name, ['announcements', index, ...keyPath], value)
  }

  onDelete (index) {
    this.props.actions.deleteSetting(this.props.name, ['announcements', index])
  }

  onAdd () {
    const nextIndex = this.props.settings.get('announcements').count()
    this.props.actions.editSetting(this.props.name, ['announcements', nextIndex], blankAnnouncement)
  }

  render () {
    const { settings } = this.props
    const canDelete = settings.has('announcements') && settings.get('announcements').count() > 1
    return (
      <div className={cx('callout')}>
        <h3>{displayName}</h3>
        <div className='callout warning'>
          <p>At present, changes will only be applied when connecting to chat.</p>
        </div>
        <table>
          <thead>
            <tr><th>Every...</th><th colSpan={2}>...say</th></tr>
          </thead>
          <tbody>
            {settings.get('announcements', []).map((announcement, index) => (
              <AnnouncementEditor
                key={index}
                announcement={announcement}
                onEdit={this.onEdit.bind(this, index)}
                onDelete={this.onDelete.bind(this, index)}
                canDelete={canDelete}
              />
            )).toArray()}
          </tbody>
        </table>
        <button type='button' className='primary large button' onClick={this.onAdd.bind(this)}>Add another</button>
      </div>
    )
  }
}

class AnnouncementEditor extends React.Component {
  onChange ({ target: { name, value } }) {
    this.props.onEdit(name, value)
  }

  onToggle ({ target: { name } }) {
    this.props.onEdit(name, !this.props.announcement.get(name))
  }

  render () {
    const { announcement, canDelete } = this.props
    return (
      <tr>
        <td>
          <div className='input-group'>
            <input
              className='input-group-field'
              type='number'
              value={announcement.getIn(['timer', 'quantity'], 30)}
              name='timer.quantity'
              onChange={this.onChange.bind(this)}
            />
            <select
              className='select-group-field'
              value={announcement.getIn(['timer', 'unit'], 'm')}
              name='timer.unit'
              onChange={this.onChange.bind(this)}
            >
              <option value='s'>seconds</option>
              <option value='m'>minutes</option>
              <option value='h'>hours</option>
            </select>
          </div>
        </td>
        <td>
          <input type='text' value={announcement.get('announcement', '')} onChange={this.onChange.bind(this)} name='announcement' />
        </td>
        <td>
          <button type='button' className={`button ${announcement.get('enabled') ? 'success' : 'secondary'}`} onClick={this.onToggle.bind(this)} name='enabled'>{announcement.get('enabled') ? 'On' : 'Off'}</button>
          {canDelete && (
            <button type='button' className={`button secondary`} onClick={this.props.onDelete}>X</button>
          )}
        </td>
      </tr>
    )
  }
}


export function getInitialSettings () {
  return {
    announcements: [
      { timer: { unit: 'm', quantity: 30 }, announcement: 'Add me on twitter!' } 
    ]
  }
}


function generateTimers (settings) {
  return settings.get('announcements')
    .filter((a) =>
      a.get('enabled') && a.get('announcement') && a.getIn(['timer', 'quantity']) > 0
    )
    .map((a) => a.update('timer', convertTimerToMs))
    .toJS()
}

function enableAnnouncements (settings, responder) {
  const timers = generateTimers(settings)
    .map(({ timer, announcement }) => setInterval(responder, timer, announcement))

  return function disableAnnouncements () {
    timers.forEach((timer) => clearInterval(timer))
  }
}

const quantityMap = { s: 1, m: 60, h: 60 * 60 }
function convertTimerToMs (timer) {
  return timer.get('quantity') * quantityMap[timer.get('unit')] * 1000
}

let chatConnected = false
export function onChatConnect (props) {
  const { settings, send } = props
  chatConnected = true
  const onDisconnect = enableAnnouncements(settings, send.bind(null, 'bot'))
  return function onChatDisconnect () {
    chatConnected = false
    onDisconnect()
  }
}
