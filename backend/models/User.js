const mongoose = require('mongoose');

// Define the base User schema
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
    required: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
    validate: {
      validator: function (value) {
        return /[!@#$%^&*(),.?":{}|<>]/.test(value);
      },
      message: 'Password must contain at least one special symbol.',
    },
  },
  email: {
    type: String,
    required: true,
    unique: true,
    match: [
      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
      'Please fill a valid email address',
    ],
  },
  phoneNumber: {
    type: String,
    required: true,
    match: [
      /^\+?[0-9]{10,15}$/,
      'Phone number must contain only digits and be between 10 and 15 characters long.',
    ],
  },
  billingAccount: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['producer', 'production professional', 'admin'],
    required: true,
  },
}, { discriminatorKey: 'role', timestamps: true });

// Export the base User model
const User = mongoose.model('User', userSchema);

module.exports = User;
