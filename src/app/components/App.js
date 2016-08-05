import React from 'react'
import Sidebar from './Sidebar'
import ChatPanel from './panels/Chat'

export default function App ({ children, props }) {
  return (
    <div>
      <Sidebar />
      <ChatPanel />
    </div>
  )
}
