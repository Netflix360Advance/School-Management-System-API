const mongoose = require('mongoose');

module.exports = async function connectDatabase() {
  try {
    // Connect to MongoDB using the full connection string from the environment variable
    await mongoose.connect(process.env.DATABASE_URL);
    console.log('Database Connected Successfully...👍');
  } catch (error) {
    console.error(`Error connecting to the database: ${error.message}`);
  }
};