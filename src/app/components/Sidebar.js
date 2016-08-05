import React from 'react'
import cx from '../lib/suitcx'

const DEFAULTS = {
  items: [
    { text: 'Chat', route: 'chat' },
    { text: 'Settings', route: 'settings', align: 'bottom' }
  ],
  route: 'chat',
  onClick: function (route, event) {
    console.log('click', route)
  }
}

export default function Sidebar ({
  items = DEFAULTS.items,
  route = DEFAULTS.route,
  onClick = DEFAULTS.onClick
}) {
  return (
    <div className={cx('Sidebar')}>
      <ul className={cx('Sidebar-list')}>
        {items.map((item, id) => (
          <SidebarItem
            key={id}
            active={item.route === route}
            onClick={onClick.bind(null, item.route)}
            {...item}
          />
        ))}
      </ul>
    </div>
  )
}

function SidebarItem ({ text, icon, align, active, onClick }) {
  const type = icon ? 'icon' : 'text'
  return (
    <li className={cx('Sidebar-item', { align, type }, { active })} onClick={onClick}>
      {icon || text[0].toUpperCase()}
    </li>
  )
}
