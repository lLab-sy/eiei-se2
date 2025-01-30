import mongoose, { Document, Schema } from "mongoose";
import { IUser, userSchema } from './user';

// Define the interface for ProductionProfessional, extending IUser
export interface IProductionProfessional extends IUser {
  occupation?: string;
  skill?: string[]; // Array of skills (e.g., ['Cameraman', 'Lighting', 'Editing'])
  experience?: number; // Years of experience
  rating?: number; // Rating out of 5
}

// Define the schema for ProductionProfessional, inheriting from UserSchema
export const productionProfessionalSchema = new Schema<IProductionProfessional>({
  occupation: {
    type: String,
    trim: true,
  },
  skill: {
    type: [String],
  },
  experience: {
    type: Number,
    min: 0, // Minimum 0 years of experience
  },
  rating: {
    type: Number,
    min: 0,
    max: 5, // Rating is between 0 and 5
  },
});

// Attach the UserSchema as the base schema
productionProfessionalSchema.add(userSchema);

// Export the model
const ProductionProfessional = mongoose.model<IProductionProfessional>('productionProfessional', productionProfessionalSchema, 'productionProfessionals');
export default ProductionProfessional;
