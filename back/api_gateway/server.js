const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 8000;

// Middleware
app.use(cors());
app.use(express.json());

// Service URLs - adjust these based on your actual service ports
const SERVICES = {
  history: process.env.HISTORY_SERVICE_URL || 'http://localhost:5001',
  search: process.env.SEARCH_SERVICE_URL || 'http://localhost:5002',
  dockyardLife: process.env.DOCKYARDLIFE_SERVICE_URL || 'http://localhost:5003'
};

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    services: SERVICES 
  });
});

// History service routes
app.get('/api/history/chapters', async (req, res) => {
  try {
    console.log('Forwarding request to history service...');
    const response = await axios.get(`${SERVICES.history}/chapters`, {
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
        // Forward any authentication headers if needed
        ...req.headers
      }
    });
    
    res.json(response.data);
  } catch (error) {
    console.error('Error calling history service:', error.message);
    
    if (error.code === 'ECONNREFUSED') {
      return res.status(503).json({
        error: 'History service unavailable',
        message: 'Unable to connect to history service',
        service: 'history'
      });
    }
    
    if (error.response) {
      // The service responded with an error status
      return res.status(error.response.status).json({
        error: 'History service error',
        message: error.response.data.message || 'Unknown error from history service',
        details: error.response.data
      });
    }
    
    // Network or other error
    res.status(500).json({
      error: 'Gateway error',
      message: 'Failed to communicate with history service',
      details: error.message
    });
  }
});

// Search service routes (placeholder for future implementation)
app.get('/api/search/*', async (req, res) => {
  try {
    const path = req.path.replace('/api/search', '');
    const response = await axios({
      method: req.method,
      url: `${SERVICES.search}${path}`,
      data: req.body,
      params: req.query,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
        ...req.headers
      }
    });
    
    res.json(response.data);
  } catch (error) {
    console.error('Error calling search service:', error.message);
    res.status(error.response?.status || 500).json({
      error: 'Search service error',
      message: error.message
    });
  }
});

// DockyardLife service routes (placeholder for future implementation)
app.get('/api/dockyardlife/*', async (req, res) => {
  try {
    const path = req.path.replace('/api/dockyardlife', '');
    const response = await axios({
      method: req.method,
      url: `${SERVICES.dockyardLife}${path}`,
      data: req.body,
      params: req.query,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
        ...req.headers
      }
    });
    
    res.json(response.data);
  } catch (error) {
    console.error('Error calling dockyardlife service:', error.message);
    res.status(error.response?.status || 500).json({
      error: 'DockyardLife service error',
      message: error.message
    });
  }
});

// Generic error handler
app.use((error, req, res, next) => {
  console.error('Gateway error:', error);
  res.status(500).json({
    error: 'Internal gateway error',
    message: error.message
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Route not found',
    message: `Route ${req.method} ${req.originalUrl} not found`,
    availableRoutes: [
      'GET /health',
      'GET /api/history/chapters',
      'GET /api/search/*',
      'GET /api/dockyardlife/*'
    ]
  });
});

app.listen(PORT, () => {
  console.log(`🚀 API Gateway running on port ${PORT}`);
  console.log(`📊 Health check available at http://localhost:${PORT}/health`);
  console.log('\n📋 Service Configuration:');
  Object.entries(SERVICES).forEach(([name, url]) => {
    console.log(`   ${name}: ${url}`);
  });
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('Received SIGTERM, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('Received SIGINT, shutting down gracefully');
  process.exit(0);
});

module.exports = app;