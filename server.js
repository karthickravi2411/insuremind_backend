const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const uploadRoutes = require('./routes/upload');
const searchRoutes = require('./routes/search');
const aggregatedPoliciesRoutes = require('./routes/aggregatedPolicies');
const monitorCPU = require('./utils/cpuMonitor');


const app = express();
const PORT =  4000;

async function connectToDatabase() {
  try {
    await mongoose.connect('mongodb://localhost:27017/insuremindDB', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 30000, // Increase timeout to 30 seconds
    });
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw new Error('Failed to connect to MongoDB');
  }
}

connectToDatabase();
// Middleware
app.use(cors()); // Allow all origins

monitorCPU();

app.use('/api', uploadRoutes);
app.use('/api', searchRoutes);
app.use('/api', aggregatedPoliciesRoutes);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
