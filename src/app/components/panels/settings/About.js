import React from 'react'

export default function AboutPanel ({ actions }) {
  return (
    <div className='text-center'>
      <button type='button' onClick={() => actions.transitionTo('about')} className='hollow button'>
        About spankhbot
      </button>
    </div>
  )
}
