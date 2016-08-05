import React from 'react'
import cx from '../lib/suitcx'

const DEFAULTS = {
  items: [
    { text: 'Chat', active: true },
    { text: 'Settings', align: 'bottom' }
  ]
}

export default function Sidebar ({ items = DEFAULTS.items }) {
  return (
    <div className={cx('Sidebar')}>
      <ul className={cx('Sidebar-list')}>
        {items.map((item, id) => <SidebarItem key={id} {...item} />)}
      </ul>
    </div>
  )
}

function SidebarItem ({ text, icon, align, active }) {
  const type = icon ? 'icon' : 'text'
  return (
    <li className={cx('Sidebar-item', { align, type }, { active })}>
      {icon || text[0].toUpperCase()}
    </li>
  )
}
