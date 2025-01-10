const Users = require('../models/user');

const handleCreateUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        
        if (!name || !email || !password) {
            return res.status(400).json({status: 400, message: "Some fields are missing" });
        }

        
        const existingUser = await Users.findOne({ email,name });
        if (existingUser) {
            return res.status(400).json({ message: "User with this email already exists" });
        }

        const newUser = new Users({
            name,
            email,
            password
        });

     
        await newUser.save();

        res.status(201).json({
            status:201,
            message: 'User created successfully',
            user: newUser
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ status: 500, message: 'Server error, please try again later' });
    }
};

const handleGetAllUsers = async (req, res) => {
    try {

        const users = await Users.find({}, { password: 0 }); 

        if (users.length === 0) {
             return res.status(404).json({
                    status: 404,
                    message: 'No users found',
                 });
            }

        res.status(200).json({
            status: 200,
            message: 'Users retrieved successfully',
            users
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: 500, message: 'Server error, please try again later' });
    }
};

// Login API
const handleLoginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ status: 400, message: "Email and password are required" });
        }

        // Find the user by email
        const user = await Users.findOne({ email });

        if (!user) {
            return res.status(404).json({ status: 404, message: "User not found" });
        }

        // Check if the password matches
        if (user.password !== password) {
            return res.status(400).json({ status: 400, message: "Invalid password" });
        }

        // Successful login
        res.status(200).json({
            status: 200,
            message: 'Login successful',
            user: { id: user._id, name: user.name, email: user.email }
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ status: 500, message: 'Server error, please try again later' });
    }
};

module.exports = { handleCreateUser,handleGetAllUsers,handleLoginUser};
