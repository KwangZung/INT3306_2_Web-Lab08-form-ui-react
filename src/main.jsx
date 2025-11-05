import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
// <redux>
import { store } from './app/store'
import { Provider } from 'react-redux'
// </redux>

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Provider store={store}>
          <App></App>
      </Provider>
    </BrowserRouter>
  </StrictMode>
)
