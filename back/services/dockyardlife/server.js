const express = require('express');
const cors = require('cors');
const { MongoClient } = require('mongodb');

const app = express();
const PORT = process.env.PORT || 5003;

app.use(cors());
app.use(express.json());

// data using ChapterParsed structure
const MONGO_URI = process.env.MONGO_URI || 'mongodb://mongo:27017';
const DB_NAME = 'Dockyard';
const COLLECTION_NAME = 'dockyardLife';

let dockyardLife = [];

async function loadChapters() {
  try {
    const client = new MongoClient(MONGO_URI, { useUnifiedTopology: true });
    await client.connect();
    const db = client.db(DB_NAME);
    const chapters = await db.collection(COLLECTION_NAME).find({}).toArray();
    dockyardLife = chapters;
    await client.close();
    console.log('Chapters loaded from MongoDB');
  } catch (error) {
    console.error('Failed to load chapters from MongoDB:', error);
  }
}

// Load chapters on server start
loadChapters();

// Get all chapters endpoint
app.get('/chapters', (req, res) => {
  try {
    console.log('DockyardLife service: Serving chapters data');
    res.json({
      success: true,
      data: dockyardLife,
      count: dockyardLife.length,
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
    service: 'dockyardlife',
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    stats: {
      totalChapters: dockyardLife.length
    }
  });
});

app.listen(PORT, () => {
  console.log(`🏭 DockyardLife service running on port ${PORT}`);
});

module.exports = app;