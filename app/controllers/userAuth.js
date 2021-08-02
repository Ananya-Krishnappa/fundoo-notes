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
      validateUserLogin
  } = require('../utils/validation.js');
  const authHelper = require('../utils/authentication.js');
  const service = require('../service/userAuth.js');

  class UserRegisterController {

      /**
       * @description register user
       * @param {*} request from client
       * @param {*} response to client
       */
      register = (req, res) => {
          try {
              //destructuring
              if (Object.keys(req.body).length === 0 && req.body.constructor === Object) {
                  return res.status(400).json({
                      message: "Invalid Params. Usage: { " +
                          "'firstName': '<first_name>'," +
                          "'lastName': '<last_name>'," +
                          "'email': '<email>'," +
                          "'phoneNumber': '<phone_number>'," +
                          "'password': '<password>'" +
                          "}"
                  });
              }
              const {
                  error,
                  value
              } = validationUserRegistration.validate(req.body);
              if (error) {
                  return res.status(400).json({
                      success: false,
                      message: error.details[0].message
                  });
              }
              // User details
              const userDetails = {
                  firstName: req.body.firstName,
                  lastName: req.body.lastName,
                  email: req.body.email,
                  phoneNumber: req.body.phoneNumber,
                  password: authHelper.encryptPassword(req.body.password)
              }
              service.register(userDetails, (error, data) => {
                  if (error) {
                      res.status(500).json({
                          success: false,
                          message: error
                      });
                  } else {
                      res.status(201).json({
                          success: true,
                          message: "User registered successfully!",
                          data: data
                      });
                  }
              });
          } catch (error) {
              res.status(500).json({
                  success: false,
                  message: error
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
              const {
                  error,
                  value
              } = validateUserLogin.validate(req.body);
              if (error) {
                  return res.status(400).json({
                      success: false,
                      message: error.details[0].message
                  });
              }
              // User details
              const userCredentials = {
                  email: req.body.email,
                  password: req.body.password
              };
              service.login(userCredentials, (error, data) => {
                  if (error) {
                      res.status(500).json({
                          success: false,
                          message: error
                      });
                  } else {
                      res.status(201).json({
                          success: true,
                          message: "User logged in!",
                          token: data
                      });
                  }
              });
          } catch (error) {
              res.status(500).json({
                  success: false,
                  message: "Some error occurred while authenticating the user"
              });
          }
      }
  }
  module.exports = new UserRegisterController();