const express = require('express');
const router = express.Router();
const { handleCreateEvent, handleGetAllEvents, handleGetEventsByDate } = require('../controllers/events');

// Create a new event
router.post('/createEvent', handleCreateEvent);

// Get all events
router.get('/getEvents', handleGetAllEvents);

// Get events by specific date (query param `date`)
router.get('/getEventsByDate', handleGetEventsByDate);

module.exports = router;
