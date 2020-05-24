import './App.scss'
import React from 'react'

import cats from './cats.json'

function App() {
  return <div className="App">{cats.length}</div>
}

export default App
