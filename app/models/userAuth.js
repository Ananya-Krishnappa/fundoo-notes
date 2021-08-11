/*
 * Purpose: Provides the schema,maps the collection documents to the javascript objects
 *
 * @description
 *
 * @author: Ananya K
 * @version: 1.0.0
 * @since: 30-07-2021
 */
const mongoose = require("mongoose");
const logger = require("../config/loggerConfig.js");

const UserRegisterSchema = mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    phoneNumber: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const UserRegister = mongoose.model("UserRegister", UserRegisterSchema);

class UserRegisterModel {
  /**
   * @description Method to register a user
   * @param {*} userDetails object and a callback
   * @param {*} res
   */
  register = (userDetails, callback) => {
    const newUser = new UserRegister({
      firstName: userDetails.firstName,
      lastName: userDetails.lastName,
      email: userDetails.email,
      phoneNumber: userDetails.phoneNumber,
      password: userDetails.password,
    });
    newUser.save((err, doc) => {
      if (err) {
        logger.error("Error while saving the new user", err);
        callback(err, null);
      } else {
        logger.info("User saved successfully", doc);
        callback(null, doc);
      }
    });
  };

  /**
   * @description Method to login
   * @param {*} userCredentials, callback
   * @param {*} res
   * @returns
   */
  findUserByEmail = (userDetails, callback) => {
    UserRegister.findOne(
      {
        email: userDetails.email,
      },
      (err, doc) => {
        if (err) {
          logger.error("Error while finding user by email", err);
          callback(err, null);
        } else {
          callback(null, doc);
        }
      }
    );
  };

  findUserById = (userDetails, callback) => {
    UserRegister.findOne(
      {
        _id: userDetails.userId,
      },
      (err, doc) => {
        if (err) {
          logger.error("Error while finding user by id", err);
          callback(err, null);
        } else {
          callback(null, doc);
        }
      }
    );
  };

  deleteUserByEmail = (email) => {
    UserRegister.deleteOne(
      {
        email: email,
      },
      (err, doc) => {
        if (err) {
          logger.error("Error while deleting user by email", err);
        } else {
          logger.info("deleted user by email successfully", err);
        }
      }
    );
  };

  updateNewPassword = (userDetails, callback) => {
    UserRegister.updateOne(
      { _id: userDetails.userId },
      { $set: { password: String(userDetails.hash) } },
      { new: true },
      (err, doc) => {
        if (err) {
          logger.error("Error while updating the password", err);
          callback(err, null);
        } else {
          logger.info("Password updated", doc);
          callback(null, doc);
        }
      }
    );
  };
}
module.exports = new UserRegisterModel();
