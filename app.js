// const express = require('express');
// const path = require('path');
// const { connectMongoDB } = require('./connection');
// const userRouter = require('./routes/users');
//  const projectRouter  = require('./routes/project');
//  const eventRouter  = require('./routes/events');



// const app = express();

// app.use(express.json());  
// app.use(express.urlencoded({ extended: true }));  

// connectMongoDB('mongodb://localhost:27017/mvc');


// app.use('/users', userRouter);  
// app.use('/project', projectRouter);  
// app.use('/event', eventRouter);

// app.listen(3000, () => {
//     console.log("Server is running on http://localhost:3000");
// });

const express = require('express');
const path = require('path');
const { connectMongoDB } = require('./connection');
const userRouter = require('./routes/users');
const projectRouter = require('./routes/project');
const eventRouter = require('./routes/events');
const chatRoutes = require('./routes/chat');

const http = require('http');
const socketIo = require('socket.io');

const app = express();

// Create HTTP server and Socket.IO instance
const server = http.createServer(app);
const io = socketIo(server);

// Make io available in the request object for routes
app.set('io', io);

// Socket.IO connection handling
io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    // Listen for chat messages and save them to the database
    socket.on('chatMessage', (message) => {
        console.log('Received message:', message);

        // Prepare message data to save to database
        const messageData = { user: socket.id, message };
        require('./controllers/chatController').saveMessage(messageData);  // Save message to the DB

        // Broadcast message to all connected clients
        io.emit('chatMessage', { user: socket.id, message });
    });

    socket.on('disconnect', () => {
        console.log('A user disconnected:', socket.id);
    });
});

// Middleware setup
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to MongoDB
connectMongoDB('mongodb://localhost:27017/mvc');

// Define routes for different resources
app.use('/users', userRouter);
app.use('/project', projectRouter);
app.use('/event', eventRouter);
app.use('/chat', chatRoutes);  // Use chat routes

// Start server
server.listen(3000, () => {
    console.log("Server is running on http://localhost:3000");
});
