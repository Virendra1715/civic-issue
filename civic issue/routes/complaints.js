const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Complaint = require('../models/Complaint');

// Configure multer for file uploads
const uploadDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Only image files are allowed!'), false);
        }
    }
});

// Create a new complaint with photo uploads
router.post('/', upload.array('photos', 5), async (req, res) => {
    try {
        const { title, description, latitude, longitude, address, city } = req.body;
        
        if (!title || !description || !latitude || !longitude || !address || !city) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        const photoPaths = req.files ? req.files.map(file => file.filename) : [];

        const complaint = new Complaint({
            title,
            description,
            location: {
                type: 'Point',
                coordinates: [parseFloat(longitude), parseFloat(latitude)],
                address,
                city
            },
            photos: photoPaths
        });

        await complaint.save();
        res.status(201).json(complaint);
    } catch (error) {
        console.error('Error creating complaint:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Get all complaints
router.get('/', async (req, res) => {
    try {
        const complaints = await Complaint.find().sort({ createdAt: -1 });
        res.json(complaints);
    } catch (error) {
        console.error('Error fetching complaints:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Get complaint by ID
router.get('/:id', async (req, res) => {
    try {
        const complaint = await Complaint.findById(req.params.id);
        if (!complaint) {
            return res.status(404).json({ error: 'Complaint not found' });
        }
        res.json(complaint);
    } catch (error) {
        console.error('Error fetching complaint:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Update complaint status
router.patch('/:id/status', async (req, res) => {
    try {
        const { status } = req.body;
        if (!['pending', 'in_progress', 'resolved'].includes(status)) {
            return res.status(400).json({ error: 'Invalid status' });
        }

        const complaint = await Complaint.findByIdAndUpdate(
            req.params.id,
            { status, updatedAt: Date.now() },
            { new: true }
        );

        if (!complaint) {
            return res.status(404).json({ error: 'Complaint not found' });
        }

        res.json(complaint);
    } catch (error) {
        console.error('Error updating complaint status:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Get complaints by city
router.get('/city/:city', async (req, res) => {
    try {
        const { city } = req.params;
        const complaints = await Complaint.find({ 'location.city': new RegExp(city, 'i') })
            .sort({ createdAt: -1 });
        res.json(complaints);
    } catch (error) {
        console.error('Error fetching complaints by city:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Get nearby complaints
router.get('/nearby', async (req, res) => {
    try {
        const { longitude, latitude, maxDistance = 5000 } = req.query; // maxDistance in meters
        
        if (!longitude || !latitude) {
            return res.status(400).json({ error: 'Longitude and latitude are required' });
        }

        const complaints = await Complaint.find({
            'location.coordinates': {
                $near: {
                    $geometry: {
                        type: 'Point',
                        coordinates: [parseFloat(longitude), parseFloat(latitude)]
                    },
                    $maxDistance: parseInt(maxDistance)
                }
            }
        }).sort({ createdAt: -1 });

        res.json(complaints);
    } catch (error) {
        console.error('Error finding nearby complaints:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
