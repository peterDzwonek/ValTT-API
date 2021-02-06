const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const morgan = require('morgan');
require('dotenv').config();
const userService = require("./Modules/userService");
global.userData = userService("mongodb+srv://userTest:userTest@cluster0.00i4t.mongodb.net/valtt_db?retryWrites=true&w=majority");

const AuthRoute = require('./Routes/Auth.route')
const EventRoute = require('./Routes/Event.route')
const MatchRoute = require('./Routes/Match.route')
const TeamRoute = require('./Routes/Team.route')

mongoose.connection.on('disconnected', () => {
    console.log('Mongoose connection disconnected uxepectedly');
});
mongoose.connection.on('close', () => {
    console.log('Mongoose connection closed');
});
process.on('SIGINT', async() => {
    console.log("[Ctrl+C] Presed: Closing Mongoose Connections");
    await mongoose.connection.close();
    process.exit(0);
});

const app = express()
//for logging the requests made to the API
app.use(morgan('dev'))
//for parsing request body coming in json format
app.use(express.json())
//for handling form data
app.use(express.urlencoded({extended: true}))

app.get('/' , async(req, res, next) =>{
    res.send("Hello from express.")
})

//whenever route used has /auth 
app.use('/auth', AuthRoute)
app.use('/event', EventRoute)
app.use('/match', MatchRoute)
app.use('/team', TeamRoute)

//for handling any non-existing routes
app.use(async(req, res, next) =>{
     next(createError.NotFound('This route does not exist'))
})

//method below triggered whenever next(error) is called
app.use((err, req, res, next) =>{
    res.status(err.status || 500)
    res.send({
        error: {
            status: err.status || 500,
            message: err.message
        }
    })
})
const PORT = process.env.PORT || 3000;

userData.initialize().then(() => {
    app.listen(PORT, () => {
        console.log(`Server running on port: ${PORT}`);
    });
}).catch((err) => {
    console.log(`An error occurred during initialization: ${err}`);
});
