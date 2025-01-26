const mongoose = require('mongoose');
const User = require('./User'); // Import the base User model

// Define the Producer schema
const producerSchema = new mongoose.Schema({
  company: {
    type: String,
    required: true,
    trim: true,
  },
});

// Create the Producer model using the discriminator
const Producer = User.discriminator('Producer', producerSchema);

module.exports = Producer;