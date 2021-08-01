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
  const authHelper = require('../utils/authenticationHelper.js');
  const service = require('../service/userRegister.service.js');

  class UserRegisterController {

      /**
       * @description register user
       * @param {*} request from client
       * @param {*} response to client
       */
      register = (req, res) => {
          try {
              //destructuring
              const {
                  error,
                  value
              } = validationUserRegistration.validate(req.body);
              if (error) {
                  return res.status(400).send({
                      message: error.details[0].message
                  });
              }
              let encryptedPassword=authHelper.encryptPassword(req.body.password);
              // User details
              const userDetails = {
                  firstName: req.body.firstName,
                  lastName: req.body.lastName,
                  email: req.body.email,
                  phoneNumber: req.body.phoneNumber,
                  password: encryptedPassword
              }
              console.log("hello",userDetails);
              service.register(userDetails, (error, data) => {
                  if (error) {
                      res.status(500).send({
                          success: false,
                          message: error
                      });
                  } else {
                      res.status(200).send({
                          success: true,
                          message: "User registered successfully!",
                          data: data
                      });
                  }
              });
          } catch (error) {
              res.status(500).send({
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
                  return res.status(400).send({
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
                      res.status(500).send({
                          success: false,
                          message: error
                      });
                  } else {
                      res.status(200).send({
                          success: true,
                          message: "User logged in!",
                          token: data
                      });
                  }
              });
          } catch (error) {
              console.log(error);
              res.status(500).send({
                  success: false,
                  message: "Some error occurred while authenticating the user"
              });
          }
      }
  }
  module.exports = new UserRegisterController();