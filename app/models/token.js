const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const logger = require("../config/loggerConfig.js");

const tokenSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "UserRegister",
  },
  token: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 3600, // this is the expiry time in seconds
  },
});
const Token = mongoose.model("Token", tokenSchema);

class TokenModel {
  saveToken = (userId, hash, callback) => {
    const newToken = new Token({
      userId: userId,
      token: hash,
      createdAt: Date.now(),
    });
    newToken.save((err, doc) => {
      if (err) {
        logger.error("Error while saving the new token", err);
        callback(err, null);
      } else {
        logger.info("Token saved successfully", doc);
        callback(null, doc);
      }
    });
  };

  findTokenByUserId = (id, callback) => {
    Token.findOne({ userId: id }, (err, doc) => {
      if (err) {
        logger.error("Error while finding token by user id", err);
        callback(err, null);
      } else {
        logger.info("Token is found", doc);
        callback(null, doc);
      }
    });
  };

  deleteTokenByUserId = (id, callback) => {
    Token.deleteOne({ userId: id }, (err, doc) => {
      if (err) {
        logger.error("Error while deleting token by user id", err);
        callback(err, null);
      } else {
        logger.info("Token is deleted");
        callback(null, "Token is deleted");
      }
    });
  };
}
module.exports = new TokenModel();
