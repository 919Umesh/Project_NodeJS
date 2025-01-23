const Location = require('../models/location');

const handleCreateLocation = async (req, res) => {
    try {
        const { name, description, photos } = req.body;

        if (!name || !description || !photos) {
            return res.status(400).json({ status: 400, message: "Some fields are missing" });
        }

        const newLocation = new Location({
            name,
            description,
            photos
        });

        await newLocation.save();

        res.status(201).json({
            status: 201,
            message: 'Location created successfully',
            location: newLocation
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ status: 500, message: 'Server error, please try again later' });
    }
};

const handleGetAllLocations = async (req, res) => {
    try {
        const locations = await Location.find();

        if (locations.length === 0) {
            return res.status(404).json({
                status: 404,
                message: 'No locations found',
            });
        }

        res.status(200).json({
            status: 200,
            message: 'Locations retrieved successfully',
            locations
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: 500, message: 'Server error, please try again later' });
    }
};

const handleDeleteLocation = async (req, res) => {
    try {
        const { id } = req.params;

        const deletedLocation = await Location.findByIdAndDelete(id);

        if (!deletedLocation) {
            return res.status(404).json({ status: 404, message: "Location not found" });
        }

        res.status(200).json({
            status: 200,
            message: 'Location deleted successfully',
            location: deletedLocation
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ status: 500, message: 'Server error, please try again later' });
    }
};

module.exports = { handleCreateLocation, handleGetAllLocations, handleDeleteLocation };