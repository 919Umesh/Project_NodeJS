const express = require('express');
const path = require('path');
const { connectMongoDB } = require('./connection');
const userRouter = require('./routes/users');
const projectRouter = require('./routes/project');
const eventRouter = require('./routes/events');
const chatRoutes = require('./routes/chat');
const productRouter = require('./routes/product');
const quizRouter = require('./routes/quiz');
const locationRouter = require('./routes/location');
const http = require('http');
const socketIo = require('socket.io');

const app = express(); 

app.use('/uploads', express.static('uploads'));

const server = http.createServer(app);
const io = socketIo(server);


app.set('io', io);

io.on('connection', (socket) => {
    const userId = socket.handshake.query.userId;
    console.log(`User connected: ${userId}, Socket ID: ${socket.id}`);

    socket.on('chatMessage', async (data) => {
        console.log(`Message from ${data.senderId} to ${data.receiverId}: ${data.message}`);

        const messageData = {
            sender: data.senderId,
            receiver: data.receiverId,
            message: data.message,
            timestamp: new Date(),
        };

     
        await require('./controllers/chatController').saveMessage(messageData);


        const receiverSocket = [...io.sockets.sockets.values()].find(
            (s) => s.handshake.query.userId === data.receiverId
        );

        if (receiverSocket) {
            receiverSocket.emit('chatMessage', messageData);
        }
    });

    // WebRTC signaling for audio calls
    socket.on('offer', (data) => {
        console.log(`Offer from ${data.senderId} to ${data.receiverId}`);
        const receiverSocket = [...io.sockets.sockets.values()].find(
            (s) => s.handshake.query.userId === data.receiverId
        );

        if (receiverSocket) {
            receiverSocket.emit('offer', { 
                senderId: data.senderId, 
                offer: data.offer 
            });
        }
    });
    
    socket.on('answer', (data) => {
        console.log(`Answer from ${data.senderId} to ${data.receiverId}`);
        const receiverSocket = [...io.sockets.sockets.values()].find(
            (s) => s.handshake.query.userId === data.receiverId
        );

        if (receiverSocket) {
            receiverSocket.emit('answer', { 
                senderId: data.senderId, 
                answer: data.answer 
            });
        }
    });

    socket.on('ice-candidate', (data) => {
        console.log(`ICE Candidate from ${data.senderId} to ${data.receiverId}`);
        const receiverSocket = [...io.sockets.sockets.values()].find(
            (s) => s.handshake.query.userId === data.receiverId
        );

        if (receiverSocket) {
            receiverSocket.emit('ice-candidate', { 
                senderId: data.senderId, 
                candidate: data.candidate 
            });
        }
    });

    
    // New event for initiating a call
    socket.on('initiateCall', (data) => {
        console.log(`Call initiated from ${data.senderId} to ${data.receiverId}`);
        const receiverSocket = [...io.sockets.sockets.values()].find(
            (s) => s.handshake.query.userId === data.receiverId
        );

        if (receiverSocket) {
            receiverSocket.emit('incomingCall', { 
                senderId: data.senderId, 
                senderName: data.senderName 
            });
        }
    });

    // New event for handling call response
    socket.on('callResponse', (data) => {
        console.log(`Call response from ${data.receiverId} to ${data.senderId}: ${data.response}`);
        const senderSocket = [...io.sockets.sockets.values()].find(
            (s) => s.handshake.query.userId === data.senderId
        );

        if (senderSocket) {
            senderSocket.emit('callResponse', { 
                receiverId: data.receiverId, 
                response: data.response 
            });
        }
    });
    socket.on('disconnect', () => {
        console.log(`User disconnected: ${userId}`);
    });
});



app.use(express.json());
app.use(express.urlencoded({ extended: true }));


connectMongoDB('mongodb://localhost:27017/mvc');
//connectMongoDB('mongodb+srv://globaltechumesh11:E.ecAk7t.2UUuyK@projectmanage.an17y.mongodb.net/');

app.use('/users', userRouter);
app.use('/project', projectRouter);
app.use('/event', eventRouter);
app.use('/chat', chatRoutes);
app.use('/product', productRouter);
app.use('/quiz', quizRouter);
app.use('/location', locationRouter);

server.listen(3000, () => {
 console.log("Server is running on http://localhost:3000");
});