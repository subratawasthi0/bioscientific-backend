const mongoose = require("mongoose");
const config = require("../config/config"); // Ensure you have your environment variables loaded

const uri = config.mongoUri;
// console.log(uri);

// const connectDB = async () => {
//   try {
//     const conn = await mongoose
//       .connect(uri, { family: 4 })
//       .then(() => console.log("******Connected*******"))
//       .catch((err) => console.error("Error:", err));
//   } catch (err) {
//     console.error(`Error connecting to MongoDB with Mongoose: ${err.message}`);
//     process.exit(1); // Exit process with failure
//   }
// };

// module.exports = connectDB;


const connectDB = async () => {
  try {
    await mongoose.connect("mongodb+srv://komalsri0_db_user:CChNxSm9afXpgizy@crest-bio.bfsri1k.mongodb.net/anjali?retryWrites=true&w=majority", {
      family: 4, // Force IPv4 - IMPORTANT for Windows!
      serverSelectionTimeoutMS: 5000, // Timeout after 5 seconds
    });
    
    console.log('✅ MongoDB Connected Successfully!');
    console.log(`📁 Database: ${mongoose.connection.db.databaseName}`);
    console.log(`🔗 Host: ${mongoose.connection.host}`);
    
    // Handle connection events
    mongoose.connection.on('error', (err) => {
      console.error('❌ MongoDB connection error:', err);
    });
    
    mongoose.connection.on('disconnected', () => {
      console.log('⚠️ MongoDB disconnected');
    });
    
  } catch (error) {
    console.error('❌ MongoDB Connection Error:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;