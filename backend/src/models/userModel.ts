import mongoose, { Schema, Document, Model } from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

// Define the interface for the User document
interface IUser extends Document {
  username: string;
  password: string;
  email?: string;
  phoneNumber?: string;
  billingAccount?: string;
  role: 'producer' | 'production professional' | 'admin';
  profile_picture?: Buffer;
  // Method to generate JWT token
  generateAuthToken: () => string;
}

// Define the User schema
const userSchema: Schema<IUser> = new Schema(
  {
    username: {
      type: String,
      unique: true,
      required: [true, 'Please add a name'],
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
      validate: {
        validator: function (value: string) {
          return /[!@#$%^&*(),.?":{}|<>]/.test(value); // Password special symbol validation
        },
        message: 'Password must contain at least one special symbol.',
      },
    },
    email: {
      type: String,
      unique: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        'Please fill a valid email address',
      ],
    },
    phoneNumber: {
      type: String,
      match: [
        /^\+?[0-9]{10,15}$/,
        'Phone number must contain only digits and be between 10 and 15 characters long.',
      ],
    },
    billingAccount: {
      type: String,
    },
    role: {
      type: String,
      enum: ['producer', 'production professional', 'admin'],
      required: true,
    },
    profile_picture: {
      type: Buffer,
    },
  },
  { discriminatorKey: 'role', timestamps: true }
);

// Method to generate JWT token
userSchema.methods.generateAuthToken = function (): string {
  const token = jwt.sign({ _id: this._id, role: this.role }, 'yourSecretKey', {
    expiresIn: '1h',
  });
  return token;
};

// Create and export the User model
const User: Model<IUser> = mongoose.model<IUser>('User', userSchema);

export default User;
