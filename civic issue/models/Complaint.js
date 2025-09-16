const mongoose = require('mongoose');

const complaintSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    location: {
        type: {
            type: String,
            enum: ['Point'],
            default: 'Point'
        },
        coordinates: {
            type: [Number],
            required: true
        },
        address: {
            type: String,
            required: true
        },
        city: {
            type: String,
            required: true
        }
    },
    photos: [{
        type: String,
        required: false
    }],
    status: {
        type: String,
        enum: ['pending', 'in_progress', 'resolved'],
        default: 'pending'
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Create 2dsphere index for geospatial queries
complaintSchema.index({ 'location.coordinates': '2dsphere' });

module.exports = mongoose.model('Complaint', complaintSchema);
