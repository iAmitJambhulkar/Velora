import mongoose from 'mongoose';

export const connectDB = async () => {
  try {
    const connUri = process.env.MONGO_URI || 'mongodb://localhost:27017/velora';
    const conn = await mongoose.connect(connUri);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error}`);
    process.exit(1);
  }
};
