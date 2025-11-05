import './App.css'

import LoginForm from './LoginForm'
import Dashboard from './Dashboard'
import { Routes, Route } from 'react-router-dom'

function App() {

  return (
    // <LoginForm></LoginForm>
    <Routes>
      <Route path="/" element={<LoginForm/>}></Route>
      <Route path="/dashboard" element={<Dashboard/>}></Route>
    </Routes>
  )
}

export default App
