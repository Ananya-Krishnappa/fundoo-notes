  /*
   * Purpose: Provides the business logic for each functionality 
   * 
   * @description
   * 
   * @author: Ananya K
   * @version: 1.0.0
   * @since: 30-07-2021
   */
  const registerModel = require('../models/userRegister.model.js');
  const bcrypt = require('bcrypt');
  const jwt = require('jsonwebtoken');

  class UserRegisterService {
      register = (userDetails, callback) => {
          registerModel.register(userDetails, (err, doc) => {
              if (err) {
                  callback(err, null);
              } else {
                  callback(null, doc);
              }
          });
      }

      login = (userCredentials, callback) => {
          const APP_SECRET = "myappsecret";
          registerModel.login(userCredentials, (err, doc) => {
              if (err) {
                  callback(err, null);
              } else {
                  if (this.comparePassword(userCredentials.password, doc.password)) {
                      let token = jwt.sign({
                          data: doc.email,
                          expiresIn: "1h"
                      }, APP_SECRET);
                      callback(null, token);
                  } else {
                      callback("Please enter a valid password", null);
                  }
              }
          });
      }

      comparePassword = (userEnteredPassword, passwordInDb) => {
          return bcrypt.compareSync(userEnteredPassword, passwordInDb)
      }
      
  }
  module.exports = new UserRegisterService();