const express = require('express');
const path = require('path');
const { connectMongoDB } = require('./connection');
const userRouter = require('./routes/users');
const projectRouter = require('./routes/project');
const eventRouter = require('./routes/events');
const chatRoutes = require('./routes/chat');
const productRouter = require('./routes/product');
const quizRouter  = require('./routes/quiz');
const http = require('http');
const socketIo = require('socket.io');
const mongoose = require('mongoose');
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

    socket.on('disconnect', () => {
        console.log(`User disconnected: ${userId}`);
    });
});



app.use(express.json());
app.use(express.urlencoded({ extended: true }));


connectMongoDB('mongodb+srv://globaltechumesh11:hwkEuf3!QvLGxxb@projectmanage.an17y.mongodb.net/');
// Connect to MongoDB Atlas
const dbURI ="mongodb+srv://globaltechumesh11:hwkEuf3!QvLGxxb@projectmanage.an17y.mongodb.net/";
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Successfully connected to MongoDB Atlas');
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB Atlas:', error);
  });


app.use('/users', userRouter);
app.use('/project', projectRouter);
app.use('/event', eventRouter);
app.use('/chat', chatRoutes);
app.use('/product', productRouter);
app.use('/quiz', quizRouter);

server.listen(3000, () => {
    console.log("Server is running on http://localhost:3000");
});
