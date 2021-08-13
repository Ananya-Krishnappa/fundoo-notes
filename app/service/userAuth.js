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
const sendEmail = require("../utils/email/sendEmail.js");
const bcrypt = require("bcrypt");

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
            logger.info("Token is generated");
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

  /**
   * @description Method to handle the reset password api which sends reset confirmation to the mail
   * @param {*} userDetails
   * @param {*} callback
   * @returns
   */

  resetPassword = (userDetails, callback) => {
    tokenService.findTokenByUserIdAndCheckIfValid(userDetails, callback);
    const hash = bcrypt.hash(userDetails.newPassword, Number(process.env.SALT_ROUNDS));
    userDetails.hash = hash;
    userModel.updateNewPassword(userDetails, (err, doc) => {
      if (err) {
        logger.error("Error while updating the new password", err);
        callback(err, null);
      } else {
        logger.info("Password reset", doc);
        userModel.findUserById(userDetails, (userErr, userDoc) => {
          if (userErr) {
            logger.error("Error while finding user by id", userErr);
            callback(userErr, null);
          } else {
            if (userDoc === null) {
              logger.info(messages.USER_NOT_FOUND);
              callback(messages.USER_NOT_FOUND, null);
            } else {
              this.sendPasswordResetConfirmation(userDoc);
              tokenService.deleteTokenPostPasswordReset(userDetails, callback);
            }
          }
        });
      }
    });
  };

  /**
   * @description Method to send password reset confirmation to email
   * @param {*} userDetails
   * @param {*} callback
   * @returns
   */
  sendPasswordResetConfirmation = (userDoc) => {
    console.log("process.env.NODE_ENV", process.env.NODE_ENV);
    if (process.env.NODE_ENV !== "test") {
      sendEmail(
        userDoc.email,
        "Password Reset Successfully",
        {
          name: userDoc.firstName,
        },
        "./template/resetPassword.handlebars"
      );
    }
  };
}

module.exports = new UserRegisterService();
