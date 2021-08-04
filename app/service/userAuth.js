/*
 * Purpose: Provides the business logic for each functionality
 *
 * @description
 *
 * @author: Ananya K
 * @version: 1.0.0
 * @since: 30-07-2021
 */
const registerModel = require("../models/userAuth.js");
const authHelper = require("../utils/authentication.js");

class UserRegisterService {
  /**
   * @description Function register user
   * @param {*} userDetails
   * @param {*} callback
   */
  register = (userDetails, callback) => {
    registerModel.register(userDetails, (err, doc) => {
      if (err) {
        callback(err, null);
      } else {
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
    registerModel.login(userCredentials, (err, doc) => {
      if (err) {
        callback(err, null);
      } else {
        if (doc === null) {
          callback("Email is incorrect", null);
        } else {
          if (authHelper.comparePassword(userCredentials.password, doc.password)) {
            callback(null, authHelper.generateToken(doc));
          } else {
            callback("Please enter a valid password", null);
          }
        }
      }
    });
  };
}
module.exports = new UserRegisterService();
