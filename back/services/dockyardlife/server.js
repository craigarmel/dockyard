const express = require('express');
const cors = require('cors');
const { MongoClient } = require('mongodb');

const app = express();
const PORT = process.env.PORT || 5003;

app.use(cors());
app.use(express.json());

const MONGO_URI = process.env.MONGO_URI || 'mongodb://mongo:27017';
const DB_NAME = 'Dockyard';
const COLLECTION_NAME = 'dockyardLife';

console.log(`🔗 MongoDB URI: ${MONGO_URI}`);
console.log(`📁 Database: ${DB_NAME}`);
console.log(`📊 Collection: ${COLLECTION_NAME}`);

// Test MongoDB connection on startup
async function testMongoConnection() {
  let client;
  try {
    console.log('🔄 Testing MongoDB connection...');
    client = new MongoClient(MONGO_URI, { 
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
      connectTimeoutMS: 10000,
    });
    
    await client.connect();
    console.log('✅ Connected to MongoDB successfully');
    
    const db = client.db(DB_NAME);
    
    // List all collections to verify database structure
    const collections = await db.listCollections().toArray();
    console.log('📋 Available collections:', collections.map(c => c.name));
    
    // Check if our specific collection exists
    const collectionExists = collections.some(c => c.name === COLLECTION_NAME);
    console.log(`📊 Collection '${COLLECTION_NAME}' exists:`, collectionExists);
    
    if (collectionExists) {
      // Count documents in the collection
      const count = await db.collection(COLLECTION_NAME).countDocuments();
      console.log(`📈 Documents in '${COLLECTION_NAME}':`, count);
      
      // Get a sample document to see data structure
      const sample = await db.collection(COLLECTION_NAME).findOne();
      if (sample) {
        console.log('📄 Sample document structure:', Object.keys(sample));
      } else {
        console.log('⚠️  Collection exists but is empty');
      }
    }
    
  } catch (error) {
    console.error('❌ MongoDB connection test failed:', error.message);
    
    if (error.message.includes('ENOTFOUND')) {
      console.error('💡 DNS resolution failed - check if MongoDB service is running');
    } else if (error.message.includes('ECONNREFUSED')) {
      console.error('💡 Connection refused - check MongoDB port and network');
    } else if (error.message.includes('authentication')) {
      console.error('💡 Authentication failed - check credentials');
    }
  } finally {
    if (client) {
      await client.close();
      console.log('🔌 MongoDB connection closed');
    }
  }
}

// Get all chapters endpoint (fetches fresh data from MongoDB)
app.get('/chapters', async (req, res) => {
  let client;
  try {
    console.log(`📡 Received request for chapters at ${new Date().toISOString()}`);
    
    client = new MongoClient(MONGO_URI, { 
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
      connectTimeoutMS: 10000,
    });
    
    console.log('🔄 Connecting to MongoDB...');
    await client.connect();
    console.log('✅ Connected to MongoDB');
    
    const db = client.db(DB_NAME);
    console.log(`📁 Using database: ${DB_NAME}`);
    
    // Check if collection exists before querying
    const collections = await db.listCollections({ name: COLLECTION_NAME }).toArray();
    if (collections.length === 0) {
      console.log(`⚠️  Collection '${COLLECTION_NAME}' not found`);
      return res.status(404).json({
        success: false,
        error: 'Collection not found',
        message: `Collection '${COLLECTION_NAME}' does not exist in database '${DB_NAME}'`,
        availableCollections: (await db.listCollections().toArray()).map(c => c.name)
      });
    }
    
    console.log(`📊 Querying collection: ${COLLECTION_NAME}`);
    const chapters = await db.collection(COLLECTION_NAME).find({}).toArray();
    console.log(`📈 Found ${chapters.length} documents`);
    
    // Log first document structure if any exist
    if (chapters.length > 0) {
      console.log('📄 First document keys:', Object.keys(chapters[0]));
    }
    
    res.json({
      success: true,
      data: chapters,
      count: chapters.length,
      collection: COLLECTION_NAME,
      database: DB_NAME,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('❌ Error serving chapters:', error);
    
    let errorMessage = error.message;
    let statusCode = 500;
    
    if (error.message.includes('ENOTFOUND')) {
      errorMessage = 'Database server not found. Check MongoDB connection.';
      statusCode = 503;
    } else if (error.message.includes('ECONNREFUSED')) {
      errorMessage = 'Cannot connect to database. Check if MongoDB is running.';
      statusCode = 503;
    } else if (error.message.includes('timeout')) {
      errorMessage = 'Database connection timeout. Please try again.';
      statusCode = 504;
    }
    
    res.status(statusCode).json({
      success: false,
      error: 'Failed to retrieve chapters',
      message: errorMessage,
      details: error.message,
      mongoUri: MONGO_URI.replace(/\/\/.*@/, '//***:***@'), // Hide credentials
      database: DB_NAME,
      collection: COLLECTION_NAME,
      timestamp: new Date().toISOString()
    });
  } finally {
    if (client) {
      await client.close();
      console.log('🔌 MongoDB connection closed');
    }
  }
});

// Debug endpoint to check database structure
app.get('/debug/database', async (req, res) => {
  let client;
  try {
    client = new MongoClient(MONGO_URI, { useUnifiedTopology: true });
    await client.connect();
    const db = client.db(DB_NAME);
    
    const collections = await db.listCollections().toArray();
    const collectionNames = collections.map(c => c.name);
    
    const result = {
      success: true,
      database: DB_NAME,
      collections: collectionNames,
      targetCollection: COLLECTION_NAME,
      targetExists: collectionNames.includes(COLLECTION_NAME)
    };
    
    // If target collection exists, get more details
    if (result.targetExists) {
      const count = await db.collection(COLLECTION_NAME).countDocuments();
      const sample = await db.collection(COLLECTION_NAME).findOne();
      
      result.documentCount = count;
      result.sampleDocument = sample ? Object.keys(sample) : null;
    }
    
    res.json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  } finally {
    if (client) await client.close();
  }
});

// Health check with enhanced info
app.get('/health', async (req, res) => {
  let mongoStatus = 'unknown';
  let client;
  
  try {
    client = new MongoClient(MONGO_URI, { 
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 3000 
    });
    await client.connect();
    mongoStatus = 'connected';
  } catch (error) {
    mongoStatus = 'disconnected';
  } finally {
    if (client) await client.close();
  }
  
  res.json({ 
    service: 'dockyardlife',
    status: 'healthy',
    mongodb: mongoStatus,
    database: DB_NAME,
    collection: COLLECTION_NAME,
    timestamp: new Date().toISOString()
  });
});

// Test MongoDB connection on startup
testMongoConnection();

app.listen(PORT, () => {
  console.log(`🏭 DockyardLife service running on port ${PORT}`);
  console.log(`🔗 Health check: http://localhost:${PORT}/health`);
  console.log(`📊 Chapters endpoint: http://localhost:${PORT}/chapters`);
  console.log(`🐛 Debug endpoint: http://localhost:${PORT}/debug/database`);
});

module.exports = app;