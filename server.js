require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const swaggerUi = require("swagger-ui-express");
const { swaggerSpecs } = require("./swagger/swaggerSpecification.js");
const dbConnectionHelper = require("./app/config/dbConnection.js");
const logger = require("./app/config/loggerConfig");
// create express app
const app = express();

app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpecs, {
    explorer: true,
  })
);

// parse requests of content-type - application/x-www-form-urlencoded
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

// parse requests of content-type - application/json
app.use(bodyParser.json());

dbConnectionHelper.connectToDb();

// Require Notes routes
require("./app/routes/userAuth.js")(app);

// listen for requests
app.listen(process.env.PORT, () => {
  console.log(`Server is listening on port ${process.env.PORT}`);
});

module.exports = app;
