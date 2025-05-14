import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        {/* Add other routes as needed */}
        <Route path="*" element={<HomePage />} /> {/* Fallback route */}
      </Routes>
    </Router>
  );
}

export default App;