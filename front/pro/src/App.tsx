import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import DocumentationPage from './pages/DocumentationPage.tsx';
import TrustPage from './pages/TrustPage.tsx';
import './index.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/documentation" element={<DocumentationPage />} />
        <Route path="/about" element={<HomePage />} /> {/* Placeholder for About Us page */}
        <Route path="/trust" element={<TrustPage />} />
        <Route path="/explore" element={<HomePage />} /> {/* Placeholder for Explore page */}
        <Route path="*" element={<HomePage />} /> {/* Fallback route */}
      </Routes>
    </Router>
  );
}

export default App;