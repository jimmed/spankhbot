import React from 'react'
import cx from '../../lib/suitcx'

const DEFAULTS = {
  messages: [
    { text: 'Hey dude, nice stream', sender: 'sippytango' },
    { text: 'Conversation of thing', sender: 'AJtastic' },
    { text: "We're talking!", sender: 'sippytango' },
    { text: 'Response to above message!', sender: 'AJtastic' },
    { text: 'I like this a lot', sender: 'sippytango' },
    { text: 'Thanks, hope you enjoy', sender: 'AJtastic' }
  ]
}

const senderImages = {
  sippytango: 'a0eaa5b55017cc1a.png',
  ajtastic: '544239b1db78c9bd.jpeg'
}

function getSenderImage (sender) {
  const [n, f] = senderImages[sender.toLowerCase()].split('.')
  return `https://static-cdn.jtvnw.net/jtv_user_pictures/${sender}-profile_image-${n}-300x300.${f}`
}

export default function ChatPanel ({ messages = DEFAULTS.messages }) {
  return (
    <div className={cx('Panel')}>
      <div className='top-bar'>
        <div className='top-bar-left'>
          <div className='menu-text'>
            Chat
          </div>
        </div>
      </div>
      <div className='ChatItems'>
        {messages.map(({ text, sender }, id) => (
          <div className='media-object' key={id}>
            <div className='media-object-section'>
              <img src={getSenderImage(sender)} width={52} height={52} />
            </div>
            <div className='media-object-section'>
              <h6><strong>{sender}</strong></h6>
              <p>
                {text}
              </p>
            </div>
          </div>
        ))}
      </div>
      <div className='input-group ChatBox'>
        <input className='input-group-field' type='text' placeholder='Sending as AJtastic' />
        <a className='input-group-button button'>Send</a>
      </div>
    </div>
  )
}
