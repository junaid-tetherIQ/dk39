const mongoose = require('mongoose');
const { Schema } = mongoose;

// Define the schema with timestamps and a unique index
const RecurringDetailSchema = new Schema({
  recurringDetailReference: { type: String, required: true, unique: true }, // Unique index added here
  paymentMethod: { type: String, required: true },
  shopperReference: { type: String, required: true },
}, { timestamps: true }); // Enable timestamps

// Create the model if it does not already exist
const RecurringDetail = mongoose.models.RecurringDetail || mongoose.model('RecurringDetail', RecurringDetailSchema);

// Export the model
module.exports = RecurringDetail;
