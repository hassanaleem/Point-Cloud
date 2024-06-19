const mongoose = require('mongoose');

// Define the schema for the data
const historySchema = new mongoose.Schema({
    updated_at: { type: Date, default: Date.now },
    update_type: {
        type: String,
        required: true
    },
});

// Create the model using the schema
const History = mongoose.model('History', historySchema);

module.exports = History;
