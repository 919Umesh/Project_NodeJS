const express = require('express');
const router = express.Router();
const { handleCreateEvent, handleGetAllEvents, handleGetEventsByDate } = require('../controllers/events');


router.post('/createEvent', handleCreateEvent);


router.get('/getEvents', handleGetAllEvents);


router.get('/getEventsByDate', handleGetEventsByDate);

module.exports = router;
