const express = require('express');
const router = express.Router();
const { handleCreateLocation, handleGetAllLocations, handleDeleteLocation } = require('../controllers/location');
const { authenticateToken } = require('../middlewares/token');

router.post('/createLocation',authenticateToken, handleCreateLocation);
router.get('/getLocations', authenticateToken, handleGetAllLocations);
router.delete('/deleteLocation/:id', authenticateToken,handleDeleteLocation);

module.exports = router;