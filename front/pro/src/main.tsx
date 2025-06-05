// In your main App component
import { BrowserRouter } from 'react-router-dom'

function App() {
  return (
    <BrowserRouter basename={import.meta.env.VITE_BASE_URL || '/dockyard/'}>
      <App />
    </BrowserRouter>
  )
}