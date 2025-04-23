import mongoose from 'mongoose'


const dbURI = 'mongodb://root:rootpassword@localhost:7007/eiei?authSource=admin';
//const dbURI = 'mongodb://root:rootpassword@mongodb-eiei:27017/eiei?authSource=admin';

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
