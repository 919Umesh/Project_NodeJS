const express = require('express');
const router = express.Router();
const { handleCreateUser,handleGetAllUsers,handleLoginUser} = require('../controllers/users');


router.post('/createUser', handleCreateUser); 
router.get('/getUsers', handleGetAllUsers);
router.post('/loginUser', handleLoginUser);
 
module.exports = router;
