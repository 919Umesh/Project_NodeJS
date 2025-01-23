const express = require('express');
const router = express.Router();
const { handleCreateUser,handleGetAllUsers,handleLoginUser} = require('../controllers/users');
const { authenticateToken } = require('../middlewares/token');

router.post('/createUser',authenticateToken, handleCreateUser); 
router.get('/getUsers',authenticateToken, handleGetAllUsers);
router.post('/loginUser',handleLoginUser);
 
module.exports = router;
