const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    console.log(`🔗 Attempting to connect to MongoDB...`);
    console.log(`📍 Connection String: ${process.env.MONGODB_URI.substring(0, 50)}...`);
    
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`⚠️  MongoDB Connection Error:`);
    console.error(`Error Code: ${error.code}`);
    console.error(`Error Message: ${error.message}`);
    console.error(`\n📌 Connection will retry on first request...`);
    console.error(`\n🔧 Troubleshooting:`);
    console.error(`1. Wait 10-15 minutes after adding IP to Network Access`);
    console.error(`2. Check if cluster is running (not paused)`);
    console.error(`3. Verify user has "Atlas Admin" role`);
    console.error(`4. Try removing and re-adding 0.0.0.0/0 to Network Access\n`);
  }
};

module.exports = connectDB;

module.exports = connectDB;
