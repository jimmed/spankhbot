import React from 'react'

export default function TwitchLoginButton ({ onClick }) {
  return (
    <img
      src='https://camo.githubusercontent.com/e3dadf5d1f371961805e6843fc7d9d611a1d14b5/687474703a2f2f7474762d6170692e73332e616d617a6f6e6177732e636f6d2f6173736574732f636f6e6e6563745f6461726b2e706e67'
      alt='Connect with Twitch'
      onClick={onClick}
    />
  )
}
