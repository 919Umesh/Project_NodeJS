const express = require('express');
const path = require('path');
const { connectMongoDB } = require('./connection');
const userRouter = require('./routes/users');
const projectRouter = require('./routes/project');
const eventRouter = require('./routes/events');
const chatRoutes = require('./routes/chat');
const productRouter = require('./routes/product');
const http = require('http');
const socketIo = require('socket.io');

const app = express(); // Initialize app here

// Serve static files
app.use('/uploads', express.static('uploads'));

// Create HTTP server and Socket.IO instance
const server = http.createServer(app);
const io = socketIo(server);

// Socket.IO connection handling
app.set('io', io);

io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    socket.on('chatMessage', (message) => {
        console.log('Received message:', message);

        const messageData = { user: socket.id, message };
        require('./controllers/chatController').saveMessage(messageData);  

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
app.use('/chat', chatRoutes);
app.use('/product', productRouter);

// Start server
server.listen(3000, () => {
    console.log("Server is running on http://localhost:3000");
});
