const mongoose = require('mongoose');

const connectDatabase = async () => {
  console.log('Attempting to connect to MongoDB...');
  try {
    await mongoose.connect(process.env.DATABASE_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected successfully!');
  } catch (error) {
    console.error('MongoDB connection failed:', error);
    process.exit(1); // This will cause the app to exit if connection fails
  }
};

module.exports = connectDatabase;