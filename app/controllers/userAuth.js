/*
 * Purpose: Provides implementation for the mapped request and forwards the request to the service layer.
 * Also, returns the response to the client
 *
 * @description
 *
 * @author: Ananya K
 * @version: 1.0.0
 * @since: 30-07-2021
 */
const {
  validationUserRegistration,
  validateUserLogin,
  validateForgotPassword,
  validateResetPassword,
} = require("../utils/validation.js");
const authHelper = require("../utils/authentication.js");
const service = require("../service/userAuth.js");
const logger = require("../config/loggerConfig.js");
const messages = require("../utils/messages.js");
class UserRegisterController {
  /**
   * @description register user
   * @param {*} request from client
   * @param {*} response to client
   */
  register = (req, res) => {
    try {
      // destructuring
      if (Object.keys(req.body).length === 0 && req.body.constructor === Object) {
        logger.error(
          "Invalid Params. Usage: { 'firstName': '<first_name>','lastName': '<last_name>','email': '<email>','phoneNumber': '<phone_number>','password': '<password>'}"
        );
        return res.status(400).json({
          message:
            "Invalid Params. Usage: { " +
            "'firstName': '<first_name>'," +
            "'lastName': '<last_name>'," +
            "'email': '<email>'," +
            "'phoneNumber': '<phone_number>'," +
            "'password': '<password>'" +
            "}",
        });
      }
      const { error, value } = validationUserRegistration.validate(req.body);
      if (error) {
        return res.status(400).json({
          success: false,
          message: error.details[0].message,
        });
      }
      // User details
      const userDetails = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        phoneNumber: req.body.phoneNumber,
        password: authHelper.encryptPassword(req.body.password),
      };
      service.register(userDetails, (error, data) => {
        if (error) {
          logger.error("Error while registering the new user", error);
          res.status(500).json({
            success: false,
            message: error,
          });
        } else {
          logger.info("User registered successfully!", data);
          res.status(201).json({
            success: true,
            message: "User registered successfully!",
            data: data,
          });
        }
      });
    } catch (error) {
      logger.error("Error while registering the new user", error);
      res.status(500).json({
        success: false,
        message: error,
      });
    }
  };

  /**
   * @description login authentication
   * @param {*} request from client
   * @param {*} response to client
   */
  login = (req, res) => {
    try {
      const { error, value } = validateUserLogin.validate(req.body);
      if (error) {
        logger.error("error.details[0].message", error);
        return res.status(400).json({
          success: false,
          message: error.details[0].message,
        });
      }
      // User details
      const userCredentials = {
        email: req.body.email,
        password: req.body.password,
      };
      service.login(userCredentials, (error, data) => {
        if (error) {
          logger.error("Error while authenticating the user", error);
          res.status(500).json({
            success: false,
            message: error,
          });
        } else {
          logger.info("User logged in!", data);
          res.status(200).json({
            success: true,
            message: "User logged in!",
            token: data,
          });
        }
      });
    } catch (error) {
      logger.error("Error while authenticating the user", error);
      res.status(500).json({
        success: false,
        message: "Some error occurred while authenticating the user",
      });
    }
  };

  /**
   * @description Method to handle the forgot password api which sends link to the mail
   * @param {*} req
   * @param {*} res
   * @returns
   */

  forgotPassword = (req, res) => {
    try {
      const { error, value } = validateForgotPassword.validate(req.body);
      if (error) {
        logger.error("User email validation failed", error);
        return res.status(400).json({
          success: false,
          message: error.details[0].message,
        });
      }
      const userDetails = {
        email: req.body.email,
      };
      service.forgotPassword(userDetails, (error, data) => {
        if (error) {
          if (error === messages.USER_NOT_FOUND) {
            logger.error("User does not exist", error);
            res.status(404).json({
              success: false,
              message: error,
            });
          } else {
            logger.error("Error while sending the password reset link", error);
            res.status(500).json({
              success: false,
              message: error,
            });
          }
        } else {
          logger.info("Password link is sent successfully!", data);
          res.status(200).json({
            success: true,
            message: "Password reset link sent to your mail!",
            data: data,
          });
        }
      });
    } catch (error) {
      logger.error("Error while sending the password reset link", error);
      res.status(500).json({
        success: false,
        message: "Some error occurred while getting the password reset link",
      });
    }
  };

  /**
   * @description Method to handle the reset password api which sends reset confirmation to the mail
   * @param {*} userDetails
   * @param {*} callback
   * @returns
   */
  resetPassword = (req, res) => {
    try {
      const { error, value } = validateResetPassword.validate(req.body);
      if (error) {
        logger.error("Password validation failed", error);
        return res.status(400).json({
          success: false,
          message: error.details[0].message,
        });
      }
      const userDetails = {
        userId: req.body.userId,
        token: req.body.token,
        newPassword: req.body.password,
      };
      service.resetPassword(userDetails, (error, data) => {
        if (error) {
          logger.error("Error while resetting the password", error);
          res.status(500).json({
            success: false,
            message: error,
          });
        } else {
          logger.info("Password reset is done successfully!", data);
          res.status(200).json({
            success: true,
            message: "Password reset is done successfully!",
            data: data,
          });
        }
      });
    } catch (error) {
      logger.error("Error while resetting the password", error);
      res.status(500).json({
        success: false,
        message: "Some error occurred while resetting the password",
      });
    }
  };
}
module.exports = new UserRegisterController();
