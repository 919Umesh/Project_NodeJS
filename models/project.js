const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    duration: {
        type: String,
        required: true 
    },
    members: {
        type: Number,
        required: true 
    },
    location: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true 
    },
    status: {
        type: String,
        enum: ['pending', 'in-progress', 'complete'], 
        default: 'pending'
    }
}, { timestamps: true });

const Project = mongoose.model('Project', projectSchema);
module.exports = Project;
