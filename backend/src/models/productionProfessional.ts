import mongoose, { Schema, Document } from 'mongoose';
import { IUser, UserSchema } from './user';

// Define the interface for ProductionProfessional, extending IUser
export interface IProductionProfessional extends IUser {
  occupation?: string;
  skill?: string[]; // Array of skills (e.g., ['Cameraman', 'Lighting', 'Editing'])
  experience?: number; // Years of experience
  rating?: number; // Rating out of 5
}

// Define the schema for ProductionProfessional, inheriting from UserSchema
const ProductionProfessionalSchema: Schema<IProductionProfessional> = new Schema({
  occupation: {
    type: String,
    //required: true,
    trim: true,
  },
  skill: {
    type: [String],
    //required: true,
  },
  experience: {
    type: Number,
    //required: true,
    min: 0, // Minimum 0 years of experience
  },
  rating: {
    type: Number,
    //required: true,
    min: 0,
    max: 5, // Rating is between 0 and 5
  },
});

// Attach the UserSchema as the base schema
ProductionProfessionalSchema.add(UserSchema);

// Export the model
const ProductionProfessional = mongoose.model<IProductionProfessional>('ProductionProfessional', ProductionProfessionalSchema, 'productionProfessionals');
export default ProductionProfessional;
