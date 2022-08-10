const mongoose = require("mongoose");

/**
 * Connects to MongoDB
 */
const connectDB =  async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    }catch (error){
        console.log(error);
        process.exit(1);
    }
}

module.exports = connectDB;