import mongoose, { Schema, Document } from 'mongoose';
import { UserSchema } from './user';

// Define the Producer schema by extending the User schema
const ProducerSchema = new Schema({
  ...UserSchema.obj, // Inherit fields from User schema
  company: {
    type: String,
    //required: [true, 'Please add a company name'],
    trim: true,
  },
});

// Export the Producer model
export default mongoose.model('Producer', ProducerSchema, 'producers');