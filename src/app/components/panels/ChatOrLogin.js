import React from 'react'
import ChatPanel from './Chat'
import LoginPanel from './Login'

export default function ChatOrLoginPanel ({ accounts }) {
  if (!accounts || !accounts.count()) {
    return <LoginPanel accounts={accounts} />
  }
  return <ChatPanel />
}
