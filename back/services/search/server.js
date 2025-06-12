const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
const { MongoClient } = require('mongodb');

const app = express();
const PORT = process.env.PORT || 5002;

app.use(cors());
app.use(express.json());

// --- MongoDB Connection and Data Fetching ---
const MONGO_URI = process.env.MONGO_URI || 'mongodb://mongo:27017';
const DB_NAME = process.env.DB_NAME || 'Dockyard';

let dockingRegister = [];
let tridentNewspaper = [];
let ratebookRecords = [];
let allRecords = [];
let dataLoaded = false;

async function loadDataFromMongo() {
  const client = new MongoClient(MONGO_URI, { 
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 5000,
    connectTimeoutMS: 10000,
  });
  
  try {
    console.log('🔄 Connecting to MongoDB...');
    await client.connect();
    console.log('✅ Connected to MongoDB');
    
    const db = client.db(DB_NAME);

    // Test if collections exist
    const collections = await db.listCollections().toArray();
    const collectionNames = collections.map(c => c.name);
    console.log('📋 Available collections:', collectionNames);

    // Load data with database field mapping
    dockingRegister = (await db.collection('dockingRegister').find({}).toArray())
      .map(r => ({ ...r, database: 'dockingRegister' }));
    
    tridentNewspaper = (await db.collection('tridentNewspaper').find({}).toArray())
      .map(r => ({ ...r, database: 'tridentNewspaper' }));
    
    ratebookRecords = (await db.collection('ratebookRecords').find({}).toArray())
      .map(r => ({ ...r, database: 'ratebookRecords' }));

    allRecords = [
      ...dockingRegister,
      ...tridentNewspaper,
      ...ratebookRecords
    ];

    dataLoaded = true;
    console.log('✅ Data loaded from MongoDB');
    console.log(`📊 Loaded records: Docking(${dockingRegister.length}), Trident(${tridentNewspaper.length}), Ratebook(${ratebookRecords.length})`);
    console.log(`📊 Total records: ${allRecords.length}`);
    
  } catch (err) {
    console.error('❌ Failed to load data from MongoDB:', err.message);
    
    // More specific error handling
    if (err.message.includes('ECONNREFUSED')) {
      console.error('💡 Make sure MongoDB is running locally');
    } else if (err.message.includes('authentication')) {
      console.error('💡 Check MongoDB credentials');
    } else if (err.message.includes('timeout')) {
      console.error('💡 Connection timeout - check MongoDB URI');
    }
    
    dataLoaded = false;
  } finally {
    await client.close();
  }
}

// Function to get current database metadata (dynamic)
function getDatabases() {
  return [
    {
      id: "dockingRegister",
      name: "Docking Register",
      description: "Official personnel records and employment details",
      icon: "📋",
      count: dockingRegister.length,
      details: "Comprehensive employment records including personal details, crafts, service dates, and career progression"
    },
    {
      id: "tridentNewspaper",
      name: "Trident Newspaper",
      description: "Portsmouth Dockyard newspaper archives",
      icon: "📰",
      count: tridentNewspaper.length,
      details: "Historical newspaper articles, announcements, obituaries, and social events from the dockyard community"
    },
    {
      id: "ratebookRecords",
      name: "Ratebook Records",
      description: "Historical wage and payment records",
      icon: "💰",
      count: ratebookRecords.length,
      details: "Weekly wage records showing hours worked, pay rates, overtime, deductions, and department assignments"
    }
  ];
}

// Middleware to check if data is loaded
function requireDataLoaded(req, res, next) {
  if (!dataLoaded) {
    return res.status(503).json({
      success: false,
      error: 'Service unavailable',
      message: 'Database is still loading. Please try again in a moment.',
      dataLoaded: false
    });
  }
  next();
}

// --- Search Logic ---
function searchAllDatabases(searchParams) {
  const { query, databases: selectedDatabases, additionalInfo } = searchParams;
  let searchableRecords = [...allRecords];

  // Filter by selected databases
  if (selectedDatabases && selectedDatabases !== "all" && Array.isArray(selectedDatabases)) {
    searchableRecords = searchableRecords.filter(record =>
      selectedDatabases.includes(record.database)
    );
  }

  let results = [];

  // Main query search
  if (query && query.trim()) {
    const queryLower = query.toLowerCase();
    results = searchableRecords.filter(record => {
      const commonMatch = record.name?.toLowerCase().includes(queryLower);

      if (record.database === "dockingRegister") {
        return (
          commonMatch ||
          record.craft?.toLowerCase().includes(queryLower) ||
          record.department?.toLowerCase().includes(queryLower) ||
          record.notes?.toLowerCase().includes(queryLower) ||
          record.entryNumber?.toLowerCase().includes(queryLower) ||
          record.skills?.some(skill => skill.toLowerCase().includes(queryLower)) ||
          record.supervisors?.some(supervisor => supervisor.toLowerCase().includes(queryLower)) ||
          record.address?.toLowerCase().includes(queryLower)
        );
      }
      if (record.database === "tridentNewspaper") {
        return (
          commonMatch ||
          record.headline?.toLowerCase().includes(queryLower) ||
          record.content?.toLowerCase().includes(queryLower) ||
          record.mentions?.some(mention => mention.toLowerCase().includes(queryLower)) ||
          record.category?.toLowerCase().includes(queryLower) ||
          record.issueNumber?.toLowerCase().includes(queryLower)
        );
      }
      if (record.database === "ratebookRecords") {
        return (
          commonMatch ||
          record.craft?.toLowerCase().includes(queryLower) ||
          record.employeeNumber?.toLowerCase().includes(queryLower) ||
          record.department?.toLowerCase().includes(queryLower) ||
          record.foreman?.toLowerCase().includes(queryLower) ||
          record.bookNumber?.toLowerCase().includes(queryLower)
        );
      }
      return false;
    });
  } else {
    results = searchableRecords;
  }

  // Additional fuzzy search
  if (additionalInfo && additionalInfo.trim()) {
    const additionalLower = additionalInfo.toLowerCase();
    const additionalResults = searchableRecords.filter(record => {
      if (record.database === "dockingRegister") {
        return (
          record.dateOfBirth?.includes(additionalLower) ||
          record.apprenticeshipYear?.includes(additionalLower) ||
          record.startDate?.includes(additionalLower) ||
          record.endDate?.includes(additionalLower) ||
          record.address?.toLowerCase().includes(additionalLower)
        );
      }
      if (record.database === "tridentNewspaper") {
        return (
          record.date?.includes(additionalLower) ||
          record.content?.toLowerCase().includes(additionalLower)
        );
      }
      if (record.database === "ratebookRecords") {
        return (
          record.weekEnding?.includes(additionalLower) ||
          record.employeeNumber?.includes(additionalLower)
        );
      }
      return false;
    });
    // Merge and deduplicate
    results = [...results, ...additionalResults].filter(
      (record, idx, arr) => arr.findIndex(r => r.id === record.id && r.database === record.database) === idx
    );
  }

  // Score and sort
  const scoredResults = results.map(record => {
    let score = 0;
    const queryLower = query?.toLowerCase() || '';
    if (record.database === "dockingRegister") {
      if (record.name?.toLowerCase().includes(queryLower)) score += 15;
      if (record.entryNumber?.toLowerCase().includes(queryLower)) score += 12;
      if (record.craft?.toLowerCase().includes(queryLower)) score += 8;
      if (record.department?.toLowerCase().includes(queryLower)) score += 5;
    }
    if (record.database === "tridentNewspaper") {
      if (record.name?.toLowerCase().includes(queryLower)) score += 15;
      if (record.headline?.toLowerCase().includes(queryLower)) score += 10;
      if (record.mentions?.some(mention => mention.toLowerCase().includes(queryLower))) score += 12;
      if (record.content?.toLowerCase().includes(queryLower)) score += 6;
    }
    if (record.database === "ratebookRecords") {
      if (record.name?.toLowerCase().includes(queryLower)) score += 15;
      if (record.employeeNumber?.toLowerCase().includes(queryLower)) score += 12;
      if (record.craft?.toLowerCase().includes(queryLower)) score += 8;
      if (record.foreman?.toLowerCase().includes(queryLower)) score += 5;
    }
    return { ...record, relevanceScore: score };
  });

  return scoredResults.sort((a, b) => b.relevanceScore - a.relevanceScore);
}

// --- API Endpoints ---

// POST /query - Main search endpoint
app.post('/query', requireDataLoaded, async (req, res) => {
  try {
    const { name, query, email, databases: selectedDatabases, additionalInfo } = req.body;

    // Validate required fields
    if (!query || !name || !email) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields',
        message: 'Query, name, and email are required fields',
        required: ['query', 'name', 'email']
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid email format',
        message: 'Please provide a valid email address'
      });
    }

    // Perform search
    const searchResults = searchAllDatabases({
      query,
      databases: selectedDatabases,
      name,
      email,
      additionalInfo
    });

    // Group results by database
    const resultsByDatabase = {
      dockingRegister: searchResults.filter(r => r.database === "dockingRegister"),
      tridentNewspaper: searchResults.filter(r => r.database === "tridentNewspaper"),
      ratebookRecords: searchResults.filter(r => r.database === "ratebookRecords")
    };

    // Prepare response
    const response = {
      success: true,
      message: `Search completed successfully. Found ${searchResults.length} records across ${Object.values(resultsByDatabase).filter(arr => arr.length > 0).length} databases.`,
      searchRequest: {
        requestId: `SR-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        submittedBy: name,
        email: email,
        query: query,
        additionalInfo: additionalInfo,
        databases: selectedDatabases,
        timestamp: new Date().toISOString()
      },
      results: {
        totalFound: searchResults.length,
        byDatabase: {
          dockingRegister: {
            count: resultsByDatabase.dockingRegister.length,
            data: resultsByDatabase.dockingRegister.map(r => ({ ...r, relevanceScore: undefined }))
          },
          tridentNewspaper: {
            count: resultsByDatabase.tridentNewspaper.length,
            data: resultsByDatabase.tridentNewspaper.map(r => ({ ...r, relevanceScore: undefined }))
          },
          ratebookRecords: {
            count: resultsByDatabase.ratebookRecords.length,
            data: resultsByDatabase.ratebookRecords.map(r => ({ ...r, relevanceScore: undefined }))
          }
        },
        allResults: searchResults.map(record => ({
          ...record,
          relevanceScore: undefined
        }))
      },
      nextSteps: searchResults.length > 0
        ? `We found ${searchResults.length} matching records across our databases. Our researchers will review these findings and contact you at ${email} with detailed information within 5-7 business days.`
        : "No exact matches found in our current digital archives, but our researchers will conduct a manual search of additional physical records and contact you if any related information is discovered."
    };

    res.json(response);

  } catch (error) {
    console.error('Error processing search request:', error);
    res.status(500).json({
      success: false,
      error: 'Search processing failed',
      message: 'An error occurred while processing your search request. Please try again.',
      details: error.message
    });
  }
});

// GET /databases - Get available databases
app.get('/databases', (req, res) => {
  try {
    const databases = getDatabases(); // Get current counts
    res.json({
      success: true,
      data: databases,
      count: databases.length,
      dataLoaded: dataLoaded,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve databases',
      message: error.message
    });
  }
});

// Health check
app.get('/health', (req, res) => {
  res.json({
    service: 'search',
    status: dataLoaded ? 'healthy' : 'loading',
    dataLoaded: dataLoaded,
    timestamp: new Date().toISOString(),
    stats: {
      totalRecords: allRecords.length,
      availableDatabases: getDatabases().length,
      recordsByDatabase: {
        dockingRegister: dockingRegister.length,
        tridentNewspaper: tridentNewspaper.length,
        ratebookRecords: ratebookRecords.length
      }
    }
  });
});

// POST /send-selected-results - Send selected records to user's email
app.post('/send-all-results', requireDataLoaded, async (req, res) => {
  try {
    const { name, email, selectedRecords } = req.body;

    if (!name || !email || !Array.isArray(selectedRecords) || selectedRecords.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields',
        message: 'Name, email, and selectedRecords (array) are required'
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid email format',
        message: 'Please provide a valid email address'
      });
    }

    // Find records by id and database
    const recordsToSend = selectedRecords.map(sel => {
      return allRecords.find(
        rec => rec.id === sel.id && rec.database === sel.database
      );
    }).filter(Boolean);

    if (recordsToSend.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'No records found',
        message: 'No matching records found for the provided selection'
      });
    }

    // Prepare email content
    const htmlRows = recordsToSend.map(r => `
      <tr>
        <td>${r.database}</td>
        <td>${r.name || r.headline || r.employeeNumber || '-'}</td>
        <td>${r.craft || r.type || '-'}</td>
        <td>${r.department || r.category || '-'}</td>
        <td>${r.dateOfBirth || r.date || r.weekEnding || '-'}</td>
        <td>${r.notes || r.content || '-'}</td>
      </tr>
    `).join('');

    const html = `
      <h2>Portsmouth Dockyard Archive: Selected Records</h2>
      <p>Dear ${name},</p>
      <p>Here are the records you requested:</p>
      <table border="1" cellpadding="6" cellspacing="0">
        <thead>
          <tr>
            <th>Database</th>
            <th>Name/Headline</th>
            <th>Craft/Type</th>
            <th>Department/Category</th>
            <th>Date</th>
            <th>Notes/Content</th>
          </tr>
        </thead>
        <tbody>
          ${htmlRows}
        </tbody>
      </table>
      <p>If you need further details, please reply to this email.</p>
      <p>Best regards,<br/>Portsmouth Dockyard Archive Team</p>
    `;

    // Configure nodemailer
    const transporter = nodemailer.createTransporter({
      service: 'gmail',
      auth: {
        user: process.env.SMTP_USER || 'craigarmel01@gmail.com',
        pass: process.env.SMTP_PASS || 'ilyr kbxs mqdd lije'
      }
    });

    await transporter.sendMail({
      from: '"Dockyard Archive" <noreply@dockyard.local>',
      to: email,
      subject: 'Your Selected Portsmouth Dockyard Archive Records',
      html
    });

    res.json({
      success: true,
      message: `Selected records sent to ${email}`,
      sentCount: recordsToSend.length
    });
  } catch (error) {
    console.error('Error sending selected results:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to send email',
      message: error.message
    });
  }
});

// --- Start Server ---
async function startServer() {
  try {
    // Load data first
    await loadDataFromMongo();
    
    // Then start server
    app.listen(PORT, () => {
      console.log(`🔍 Search service running on port ${PORT}`);
      console.log(`📊 Loaded ${allRecords.length} records from all databases`);
      console.log(`🚀 Server ready to accept requests`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

startServer();

module.exports = app;