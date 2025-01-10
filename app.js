const express = require('express');
const path = require('path');
const { connectMongoDB } = require('./connection');
const userRouter = require('./routes/users');
 const projectRouter  = require('./routes/project');
 const eventRouter  = require('./routes/events');



const app = express();

app.use(express.json());  
app.use(express.urlencoded({ extended: true }));  

connectMongoDB('mongodb://localhost:27017/mvc');


app.use('/users', userRouter);  
app.use('/project', projectRouter);  
app.use('/event', eventRouter);

app.listen(3000, () => {
    console.log("Server is running on http://localhost:3000");
});
