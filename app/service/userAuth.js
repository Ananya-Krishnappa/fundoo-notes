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
const tokenModel = require("../models/token.js");
const authHelper = require("../utils/authentication.js");
const messages = require("../utils/messages.js");
const sendEmail = require("../utils/email/sendEmail.js");
const logger = require("../config/loggerConfig.js");
const crypto = require("crypto");
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
          tokenModel.findTokenByUserId(doc._id, (tokenError, tokenDoc) => {
            if (tokenError) {
              logger.error("Error while finding token by user id", err);
              callback(tokenError, null);
            } else {
              if (tokenDoc) {
                tokenModel.deleteTokenByUserId(tokenDoc.userId, (tokenDeleteErr, tokenDeleteSuccess) => {
                  if (tokenDeleteErr) {
                    logger.error("Error while deleting the token by user id", err);
                    callback(tokenDeleteErr, null);
                  } else {
                    logger.info("Token deleted");
                  }
                });
              }
            }
          });
          let resetToken = crypto.randomBytes(32).toString("hex");
          const hash = bcrypt.hash(resetToken, Number(process.env.SALT_ROUNDS));
          tokenModel.saveToken(doc._id, String(hash), (saveTokenErr, saveTokenSuccess) => {
            if (saveTokenErr) {
              logger.error("Error while saving the token", err);
              callback(saveTokenErr, null);
            } else {
              const link = `${process.env.CLIENT_URL}/passwordReset?token=${resetToken}&id=${doc._id}`;
              sendEmail(
                doc.email,
                "Password Reset Request",
                { name: doc.firstName, link: link },
                "./template/forgotPassword.handlebars"
              );
              callback(null, link);
            }
          });
        }
      }
    });
  };
}
module.exports = new UserRegisterService();
