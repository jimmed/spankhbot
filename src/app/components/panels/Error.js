import React from 'react'
import cx from '../../lib/suitcx'

export default function Error ({ message, severity }) {
  return (
    <div className={cx('Panel')}>
      <div className='top-bar'>
        <div className='top-bar-left'>
          <div className='menu-text'>
            Error
          </div>
        </div>
      </div>
      <div className={`callout ${severity}`}>
        <h5>Unknown panel</h5>
        <p>{message}</p>
      </div>
    </div>
  )
}
