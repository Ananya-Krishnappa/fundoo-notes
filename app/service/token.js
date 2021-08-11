/*
 * Purpose: Provides the business logic for each functionality
 *
 * @description
 *
 * @author: Ananya K
 * @version: 1.0.0
 * @since: 10-08-2021
 */
const tokenModel = require("../models/token.js");
const sendEmail = require("../utils/email/sendEmail.js");
const logger = require("../config/loggerConfig.js");
const crypto = require("crypto");
const bcrypt = require("bcrypt");
class TokenService {
  /**
   * @description Function to find user by id
   * @param {*} doc
   * @param {*} callback
   */
  findTokenByUserId = (doc, callback) => {
    tokenModel.findTokenByUserId(doc._id, (tokenError, tokenDoc) => {
      if (tokenError) {
        logger.error("Error while finding token by user id", tokenError);
        callback(tokenError, null);
      } else {
        if (tokenDoc) {
          this.deleteTokenByUserId(tokenDoc, callback);
        }
      }
    });
  };

  /**
   * @description Function to find user by id
   * @param {*} tokenDoc
   * @param {*} callback
   */
  deleteTokenByUserId = (tokenDoc, callback) => {
    tokenModel.deleteTokenByUserId(tokenDoc.userId, (tokenDeleteErr, tokenDeleteSuccess) => {
      if (tokenDeleteErr) {
        logger.error("Error while deleting the token by user id", tokenDeleteErr);
        callback(tokenDeleteErr, null);
      } else {
        logger.info("Token deleted");
      }
    });
  };

  /**
   * @description Function to find user by id
   * @param {*} doc
   * @param {*} callback
   */
  generateAndSaveToken = (doc, callback) => {
    let resetToken = crypto.randomBytes(32).toString("hex");
    const hash = bcrypt.hash(resetToken, Number(process.env.SALT_ROUNDS));
    tokenModel.saveToken(doc._id, String(hash), (saveTokenErr, saveTokenSuccess) => {
      if (saveTokenErr) {
        logger.error("Error while saving the token", err);
        callback(saveTokenErr, null);
      } else {
        const link = `${process.env.CLIENT_URL}/passwordReset?token=${resetToken}&id=${doc._id}`;
        this.sendPasswordResetLink(doc, link);
        callback(null, link);
      }
    });
  };

  /**
   * @description Function to send password link to email
   * @param {*} doc
   * @param {*} link
   */
  sendPasswordResetLink = (doc, link) => {
    sendEmail(
      doc.email,
      "Password Reset Request",
      { name: doc.firstName, link: link },
      "./template/forgotPassword.handlebars"
    );
  };

  findTokenByUserIdAndCheckIfValid = (userDetails, callback) => {
    tokenModel.findTokenByUserId(userDetails.userId, (tokenError, tokenDoc) => {
      if (tokenError) {
        logger.error("Error while finding token by user id", err);
        callback(tokenError, null);
      } else {
        if (null === tokenDoc) {
          const errorMessage = "Invalid or expired password reset token";
          logger.error(errorMessage);
          callback(errorMessage, null);
        } else {
          const isValid = bcrypt.compare(userDetails.token, tokenDoc.token);
          if (!isValid) {
            const errorMessage = "Invalid or expired password reset token";
            logger.error(errorMessage);
            callback(errorMessage, null);
          }
        }
      }
    });
  };

  deleteTokenPostPasswordReset = (tokenDoc, callback) => {
    tokenModel.deleteTokenByUserId(tokenDoc.userId, (tokenDeleteErr, tokenDeleteSuccess) => {
      if (tokenDeleteErr) {
        logger.error("Error while deleting the token by user id", tokenDeleteErr);
        callback(tokenDeleteErr, null);
      } else {
        logger.info("Token deleted");
        callback(null, "Password reset successfull!");
      }
    });
  };
}
module.exports = new TokenService();
