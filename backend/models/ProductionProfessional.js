const mongoose = require('mongoose');
const User = require('./User'); // Import the base User model

// Define the ProductionProfessional schema
const productionProfessionalSchema = new mongoose.Schema({
  occupation: {
    type: String,
    required: true,
    trim: true,
  },
  skill: {
    type: [String], // Array of skills
    required: true,
  },
  experience: {
    type: Number, // Experience in years
    required: true,
    min: 0,
  },
  rating: {
    type: Number,
    default: 0, // Default rating
    min: 0,
    max: 5,
  },
});

// Add a custom method to get reviews
productionProfessionalSchema.methods.getReviews = function () {
  // This is a placeholder method
  // Replace this with logic to fetch reviews based on the ProductionProfessional's ID
  console.log(`Fetching reviews for production professional: ${this.username}`);
  return [];
};

// Create the ProductionProfessional model using the discriminator
const ProductionProfessional = User.discriminator(
  'ProductionProfessional',
  productionProfessionalSchema
);

module.exports = ProductionProfessional;