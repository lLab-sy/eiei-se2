import mongoose, { Document, Schema } from "mongoose";

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
}

export interface IBankAccount extends Document {
  bankName?: string;
  accountHolderName?: string;
  accountNumber?: string;
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
});

const User = mongoose.model<IUser>("user", userSchema, "users");
export default User;
