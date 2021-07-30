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
      validationSchema
  } = require('../utils/validation.js');
  const bcrypt = require('bcrypt');
  const service = require('../service/userRegister.service.js');

  class UserRegisterController {

      register = (req, res) => {
          try {
              const saltRounds = 10;
              //destructuring
              const {
                  error,
                  value
              } = validationSchema.validate(req.body);
              if (error) {
                  return res.status(400).send({
                      message: error.details[0].message
                  });
              }
              // User details
              const userDetails = {
                  firstName: req.body.firstName,
                  lastName: req.body.lastName,
                  email: req.body.email,
                  phoneNumber: req.body.phoneNumber,
                  password: bcrypt.hashSync(req.body.password, saltRounds)
              };
              service.register(userDetails, (error, data) => {
                  if (error) {
                      res.status(500).send({
                          success: false,
                          message: "Some error occurred while registering the user"
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
              console.log(error);
              res.status(500).send({
                  success: false,
                  message: "Some error occurred while registering user"
              });
          }
      };
  }
  module.exports = new UserRegisterController();