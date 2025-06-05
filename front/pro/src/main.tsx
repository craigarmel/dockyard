// In your main App component
import { BrowserRouter } from 'react-router-dom'

function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL_VITE || '/dockyard/'}>
      <App />
    </BrowserRouter>
  )
}