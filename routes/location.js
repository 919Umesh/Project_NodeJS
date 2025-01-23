const express = require('express');
const router = express.Router();
const { handleCreateLocation, handleGetAllLocations, handleDeleteLocation } = require('../controllers/location');
const { authenticateToken } = require('../middlewares/token');

router.post('/createLocation', handleCreateLocation);
router.get('/getLocations',  handleGetAllLocations);
router.delete('/deleteLocation/:id', handleDeleteLocation);

module.exports = router;