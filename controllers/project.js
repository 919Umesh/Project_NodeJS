const Project = require('../models/project');

// Create a new project
const handleCreateProject = async (req, res) => {
    try {
        const { name, duration, members, location, amount, status } = req.body;

        
        if (!name || !duration || !members || !location || !amount) {
            return res.status(400).json({ status: 400, message: 'Some fields are missing' });
        }

        const existingProject = await Project.findOne({ name });
           if (existingProject) {
              return res.status(400).json({ status: 400, message: 'Project with this name already exists' });
           }
   
        const allowedStatuses = ['pending', 'in-progress', 'complete'];
        if (status && !allowedStatuses.includes(status)) {
            return res.status(400).json({ status: 400, message: 'Invalid status value' });
        }

        const newProject = new Project({
            name,
            duration,
            members,
            location,
            amount,
            status: status || 'pending' 
        });

        await newProject.save();
        res.status(201).json({
            status: 201,
            message: 'Project created successfully',
            project: newProject
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: 500, message: 'Server error, please try again later' });
    }
};

const handleGetProjects = async (req, res) => {
    try {
        const { status } = req.query;
        const query = {};
        if (status) {
            const allowedStatuses = ['pending', 'in-progress', 'complete'];
            if (!allowedStatuses.includes(status)) {
                return res.status(400).json({ status: 400, message: 'Invalid status filter' });
            }
            query.status = status;
        }

        const projects = await Project.find(query);

        res.status(200).json({
            status: 200,
            message: 'Projects retrieved successfully',
            projects
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: 500, message: 'Server error, please try again later' });
    }
};

const handleSearchProjects = async (req, res) => {
    try {
        const { name, location, status, minAmount, maxAmount } = req.query;

        const query = {};

        // Add name filter (case-insensitive)
        if (name) {
            query.name = { $regex: name, $options: 'i' }; // Case-insensitive match
        }

        // Add location filter (case-insensitive)
        if (location) {
            query.location = { $regex: location, $options: 'i' }; // Case-insensitive match
        }

        // Add status filter
        if (status) {
            const allowedStatuses = ['pending', 'in-progress', 'complete'];
            if (!allowedStatuses.includes(status)) {
                return res.status(400).json({ status: 400, message: 'Invalid status filter' });
            }
            query.status = status;
        }

        // Add amount range filter
        if (minAmount || maxAmount) {
            query.amount = {};
            if (minAmount) query.amount.$gte = parseFloat(minAmount); // Greater than or equal to minAmount
            if (maxAmount) query.amount.$lte = parseFloat(maxAmount); // Less than or equal to maxAmount
        }

        // Fetch matching projects
        const projects = await Project.find(query);

        res.status(200).json({
            status: 200,
            message: 'Projects retrieved successfully',
            projects
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: 500, message: 'Server error, please try again later' });
    }
};


module.exports = { handleCreateProject, handleGetProjects,handleSearchProjects };
