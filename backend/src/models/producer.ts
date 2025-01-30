import mongoose, { Document, Schema } from "mongoose";
import { IUser, userSchema } from "./user";

// Define the interface for ProductionProfessional, extending IUser
export interface IProducer extends IUser {
  company?: string;
  paymentType?: "qrCode" | "creditDebit";
  nameOnCard?: string; //for Credit/Debit
  cardNumber?: string; //for Credit/Debit
}

// Define the schema for Producer, inheriting from UserSchema
export const producerSchema = new Schema<IProducer>({
  company: {
    type: String,
    trim: true,
  },
  paymentType: {
    type: String,
    enum: ["qrCode", "creditDebit"],
  },
  nameOnCard: {
    type: String,
  },
  cardNumber: {
    type: String,
  },
});

// Attach the UserSchema as the base schema
producerSchema.add(userSchema);

// Export the model
const Producer = mongoose.model<IProducer>("producer", producerSchema, "producers");
export default Producer;
