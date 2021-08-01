require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const dbConnectionHelper = require('./app/utils/dbConnectionHelper');

// create express app
const app = express();

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({
    extended: true
}))

// parse requests of content-type - application/json
app.use(bodyParser.json())

dbConnectionHelper.connectToDb();

// define a simple route
app.get('/', (req, res) => {
    res.json({
        "message": "Welcome to Fundoo-Notes application. Take notes quickly. Organize and keep track of all your notes."
    });
});

// Require Notes routes
require('./app/routes/userRegister.routes.js')(app);

// listen for requests
app.listen(process.env.PORT, () => {
    console.log(`Server is listening on port ${process.env.PORT}`);
});