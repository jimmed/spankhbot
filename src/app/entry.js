import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'

import App from './components/App'
import configureStore from './store/configureStore'

import 'foundation/dist/foundation.css'
import './styles/index.css'

const store = configureStore()

const app = (
  <Provider store={store}>
    <App />
  </Provider>
)

// Render app
render(app, document.getElementById('app'))
