import mongoose, { Schema, Document } from "mongoose";
import { IUser, UserSchema } from "./user";

// Define the interface for ProductionProfessional, extending IUser
export interface IProducer extends IUser {
  company?: string;
  paymentType?: "qrCode" | "creditDebit";
  nameOnCard?: string; //for Credit/Debit
  cardNumber?: string; //for Credit/Debit
}

// Define the schema for Producer, inheriting from UserSchema
const ProducerSchema: Schema<IProducer> = new Schema({
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
ProducerSchema.add(UserSchema);

// Export the model
const Producer = mongoose.model<IProducer>(
  "Producer",
  ProducerSchema,
  "producers"
);
export default Producer;
