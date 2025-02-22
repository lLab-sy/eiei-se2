import mongoose, { Document, Schema } from "mongoose";

// Common user fields
// Interface for User Document: require are name, password, role; which user must input at registration.
export interface IUser extends Document {
  username: string;
  password: string;
  role: "producer" | "production professional" | "admin";
  email?: string;
  firstName?: string;
  middleName?: string;
  lastName?: string;
  phoneNumber?: string;
  gender?: "Male" | "Female" | "Non-Binary" | "Other";
  bankAccount?: IBankAccount;
  profileImage?: string;
  resetPasswordToken?: string;
  resetPasswordExpire?: Date;
  createdAt?: Date;
  url? : string;
}

export interface IBankAccount extends Document {
  bankName?: string;
  accountHolderName?: string;
  accountNumber?: string;
}

// Producer-specific fields
export interface IProducer extends IUser {
  company?: string;
  paymentType?: "qrCode" | "creditDebit";
  nameOnCard?: string; //for Credit/Debit
  cardNumber?: string; //for Credit/Debit
}

// ProductionProfessional-specific fields
export interface IProductionProfessional extends IUser {
  occupation?: string;
  description?: string;
  skill?: string[]; // Array of skills (e.g., ['Cameraman', 'Lighting', 'Editing'])
  experience?: number; // Years of experience
  rating?: Array<{
    ratingScore?: number
    comment?: string
  }>;
}

export const BankAccountSchema = new Schema<IBankAccount>({
  bankName: { type: String,},
  accountHolderName: { type: String,},
  accountNumber: { type: String,},
});

// User Schema Definition
export const userSchema = new Schema<IUser>({
  username: {
    type: String,
    unique: true,
    required: [true, "Please add a name"],
  },
  password: {
    type: String,
    required: [true, "Please add a password"],
    minlength: 8,
    validate: {
      validator: function (value: string) {
        return /[!@#$%^&*(),.?":{}|<>+-]/.test(value);
      },
      message: "Password must contain at least one special symbol.",
    },
    select: false,
  },
  role: {
    type: String,
    enum: ["producer", "production professional", "admin"],
    required: true,
  },
  email: {
    type: String,
    unique: true,
    sparse: true,
    match: [
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      "Please add a valid email",
    ],
  },
  firstName: {
    type: String,
    trim: true,
  },
  middleName: {
    type: String,
    trim: true,
  },
  lastName: {
    type: String,
    trim: true,
  },
  phoneNumber: {
    type: String,
    match: [
      /^\+?[0-9]{10,15}$/,
      "Phone number must contain only digits and be between 10 and 15 characters long.",
    ],
  },
  gender: {
    type: String,
    enum: ["Male", "Female", "Non-Binary", "Other"],
  },
  bankAccount: {
    type: BankAccountSchema,
  },
  profileImage: {
    type: String,
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  createdAt: {
    type: Date,
    default: Date.now,
  },
},{ discriminatorKey: "role", timestamps: true } // <-- Discriminator Key
);

//Base Model
export const User = mongoose.model<IUser>("user", userSchema);

// Producer Schema
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

export const Producer = User.discriminator<IProducer>("producer", producerSchema); // <-- Discriminator

// Production Professional Schema
export const productionProfessionalSchema = new Schema<IProductionProfessional>({
  occupation: {
    type: String,
    trim: true,
  },
  description: {
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
  rating: [{
    postID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "postTypes",
      required: true,
    },
    ratingScore: {
      type: Number,
      min: 0,
      max: 5, // Rating is between 0 and 5
    },
    comment: {
      type: String,
    },
    createdAt: {
      type: Date,
      default: Date.now, // Automatically sets the current timestamp when the review is created
    },
  }],
});

// for full-text search
// productionProfessionalSchema.index({firstName: 'text', middleName: 'text', lastName: 'text', skill: 'text'})

// for regex search
productionProfessionalSchema.index({firstName: 1, middleName: 1, lastName: 1, skill: 1})

export const ProductionProfessional = User.discriminator<IProductionProfessional>("production professional", productionProfessionalSchema); // <-- Discriminator

//export default {User, Producer, ProductionProfessional};

export interface searchReqModel {
  searchText?: string;
  minExperience?: number;
  maxExperience?: number;
  minRating?: number;
  limit: number;
  page: number;
}

export interface searchProductionProfessionalResponse {
  data: IProductionProfessional[];
  totalItems: number;
}