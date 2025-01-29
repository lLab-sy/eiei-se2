import mongoose from 'mongoose'
import dotenv from 'dotenv';

dotenv.config();

const dbURI = process.env.MONGO_URI || ""

const connectDB = async () => {
    try {
        await mongoose.connect(dbURI);
        console.log('MongoDB Connected');
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

export default connectDB;
