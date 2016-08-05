import React from 'react'

export default function Sidebar ({props}) {
  return (
    <div className='sidebar'>
      <pre>{JSON.stringify(props, null, 2)}</pre>
    </div>
  )
}
