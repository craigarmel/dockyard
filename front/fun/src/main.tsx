// In your main App component
import { BrowserRouter } from 'react-router-dom'
import App from './App.tsx';

function Root() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL_VITE || '/dockyard/'}>
      <App />
    </BrowserRouter>
  );
}

export default Root;