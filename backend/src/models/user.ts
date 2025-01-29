import mongoose, { Schema, Document } from 'mongoose';
//import bcrypt from 'bcryptjs';
//import jwt from 'jsonwebtoken';

// Interface for User Document: require are name, password, role; which user must input at registration. 
export interface IUser extends Document {
  name: string;
  email?: string;
  role: 'producer' | 'production professional' | 'admin';
  password: string;
  firstName?: string;
  middleName?: string;
  lastName?: string;
  phoneNumber?: string;
  gender?: 'Male' | 'Female' | 'Other' | 'Prefer not to say';
  billingAccount?: string;
  profileImage?: string;
  resetPasswordToken?: string;
  resetPasswordExpire?: Date;
  createdAt?: Date;
  //getSignedJwtToken(): string;
  //matchPassword(enteredPassword: string): Promise<boolean>;
}

// User Schema Definition
const UserSchema: Schema = new Schema({
  name: {
    type: String,
    unique: true,
    required: [true, 'Please add a name'],
  },
  email: {
    type: String,
    //required: [true, 'Please add an email'],
    //unique: true,
    match: [
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      'Please add a valid email',
    ],
  },
  role: {
    type: String,
    enum: ['producer', 'production professional', 'admin'],
    required: true,
  },
  password: {
    type: String,
    required: [true, 'Please add a password'],
    minlength: 8,
    validate: {
      validator: function (value: string) {
        return /[!@#$%^&*(),.?":{}|<>+-]/.test(value);
      },
      message: 'Password must contain at least one special symbol.',
    },
    select: false,
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
      'Phone number must contain only digits and be between 10 and 15 characters long.',
    ],
  },
  gender: {
    type: String,
    enum: ['Male', 'Female', 'Other', 'Prefer not to say'],
  },
  billingAccount: {
    type: String,
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

//Below is the logic for authen, I don't know that should we use it now or later.
//So I will comment them until we need to use the logic below, feel free to use it if you want.
/*
// Encrypt password before saving the user
UserSchema.pre<IUser>('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Generate JWT Token
UserSchema.methods.getSignedJwtToken = function (): string {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET || 'secret', {
    expiresIn: process.env.JWT_EXPIRE || '1d',
  });
};

// Match user entered password to hashed password in the database
UserSchema.methods.matchPassword = async function (enteredPassword: string): Promise<boolean> {
  return await bcrypt.compare(enteredPassword, this.password);
};
*/

const User = mongoose.model<IUser>('User', UserSchema, 'users');
export default User;
export { UserSchema };
