const express = require('express');
const cors = require('cors');
const { MongoClient } = require('mongodb');
const http = require('http');

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

// Create a server object
const server = http.createServer((req, res) => {
    // Set the response header
    res.writeHead(200, {'Content-Type': 'text/plain'});
    // Write some text to the response
    res.end('Welcome to my simple Node.js app!');
});
// Mock data based on ChapterParsed type
const MONGO_URI = process.env.MONGO_URI || 'mongodb://mongo:27017';
const DB_NAME = 'Dockyard';
const COLLECTION_NAME = 'history';

let history = [];

async function fetchHistoryFromDB() {
  try {
    const client = new MongoClient(MONGO_URI, { useUnifiedTopology: true });
    await client.connect();
    const db = client.db(DB_NAME);
    const collection = db.collection(COLLECTION_NAME);
    history = await collection.find({}).toArray();
    await client.close();
    console.log('History data loaded from MongoDB');
  } catch (error) {
    console.error('Failed to load history from MongoDB:', error);
    history = [];
  }
}

// Fetch data on server start
fetchHistoryFromDB();

// Get all chapters endpoint
app.get('/chapters', (req, res) => {
  try {
    console.log('History service: Serving chapters data');
    res.json({
      success: true,
      data: history,
      count: history.length,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error serving chapters:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve chapters',
      message: error.message
    });
  }
});

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    service: 'history',
    status: 'healthy', 
    timestamp: new Date().toISOString() 
  });
});

app.listen(PORT, () => {
  console.log(`📚 History service running on port ${PORT}`);
});

module.exports = app;