import React from 'react'
import cx from 'suitcx'

export default function Sidebar ({ items, route, onClick }) {
  return (
    <div className={cx('Sidebar')}>
      <ul className={cx('Sidebar-list')}>
        {items.toJS().map((item, id) => (
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
