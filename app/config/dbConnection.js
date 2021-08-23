const mongoose = require("mongoose");
const logger = require("./loggerConfig");
class DbConnectionHelper {
  connectToDb = () => {
    mongoose.Promise = global.Promise;
    // Connecting to the database
    mongoose
      .connect(process.env.DB_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        useCreateIndex: true,
        autoIndex: true,
      })
      .then(() => {
        logger.info("Successfully connected to the database");
      })
      .catch((err) => {
        logger.info("Could not connect to the database. Exiting now...", err);
        process.exit();
      });
  };
}

module.exports = new DbConnectionHelper();
