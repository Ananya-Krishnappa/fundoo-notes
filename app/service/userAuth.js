/*
 * Purpose: Provides the business logic for each functionality
 *
 * @description
 *
 * @author: Ananya K
 * @version: 1.0.0
 * @since: 30-07-2021
 */
const userModel = require("../models/userAuth.js");
const tokenService = require("./token.js");
const authHelper = require("../utils/authentication.js");
const messages = require("../utils/messages.js");
const logger = require("../config/loggerConfig.js");

class UserRegisterService {
  /**
   * @description Function register user
   * @param {*} userDetails
   * @param {*} callback
   */
  register = (userDetails, callback) => {
    userModel.register(userDetails, (err, doc) => {
      if (err) {
        logger.error("Error while registering the new user", err);
        callback(err, null);
      } else {
        logger.info("User registered successfully!", doc);
        callback(null, doc);
      }
    });
  };

  /**
   * @description Function login user
   * @param {*} userDetails
   * @param {*} callback
   */
  login = (userCredentials, callback) => {
    userModel.findUserByEmail(userCredentials, (err, doc) => {
      if (err) {
        logger.error("Error while finding user by email", err);
        callback(err, null);
      } else {
        if (doc === null) {
          logger.info("User does not exist", doc);
          callback("User does not exist", null);
        } else {
          if (authHelper.comparePassword(userCredentials.password, doc.password)) {
            logger.info("Token is generated", authHelper.generateToken(doc));
            callback(null, authHelper.generateToken(doc));
          } else {
            logger.info("Please enter a valid password");
            callback("Please enter a valid password", null);
          }
        }
      }
    });
  };

  /**
   * @description Method to handle the forgot password api which sends link to the mail
   * @param {*} req
   * @param {*} res
   * @returns
   */

  forgotPassword = (userDetails, callback) => {
    userModel.findUserByEmail(userDetails, (err, doc) => {
      if (err) {
        logger.error("Error while finding user by email", err);
        callback(err, null);
      } else {
        if (doc === null) {
          logger.info("User does not exist", doc);
          callback(messages.USER_NOT_FOUND, null);
        } else {
          tokenService.findTokenByUserId(doc, callback);
          tokenService.generateAndSaveToken(doc, callback);
        }
      }
    });
  };
}
module.exports = new UserRegisterService();
