const Event = require('../models/event');

// Handle creating a new event
const handleCreateEvent = async (req, res) => {
    try {
        const { title, description, date } = req.body;

        if (!title || !description || !date) {
            return res.status(400).json({ status: 400, message: "Some fields are missing" });
        }

        const newEvent = new Event({
            title,
            description,
            date: new Date(date)
        });

        await newEvent.save();

        res.status(201).json({
            status: 201,
            message: 'Event created successfully',
            event: newEvent
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ status: 500, message: 'Server error, please try again later' });
    }
};

// Handle retrieving all events
const handleGetAllEvents = async (req, res) => {
    try {
        const events = await Event.find({}).sort({ date: 1 });

        if (events.length === 0) {
            return res.status(404).json({ status: 404, message: 'No events found' });
        }

        res.status(200).json({
            status: 200,
            message: 'Events retrieved successfully',
            events
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: 500, message: 'Server error, please try again later' });
    }
};

// Handle retrieving events for a specific day
const handleGetEventsByDate = async (req, res) => {
    try {
        const { date } = req.query;

        if (!date) {
            return res.status(400).json({ status: 400, message: 'Date is required' });
        }

        const dayStart = new Date(date);
        const dayEnd = new Date(date);
        dayEnd.setDate(dayEnd.getDate() + 1);

        const events = await Event.find({
            date: {
                $gte: dayStart,
                $lt: dayEnd
            }
        });

        if (events.length === 0) {
            return res.status(404).json({ status: 404, message: 'No events found for this date' });
        }

        res.status(200).json({
            status: 200,
            message: 'Events retrieved successfully',
            events
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ status: 500, message: 'Server error, please try again later' });
    }
};

module.exports = { handleCreateEvent, handleGetAllEvents, handleGetEventsByDate };
