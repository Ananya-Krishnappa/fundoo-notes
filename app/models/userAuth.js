  /*
   * Purpose: Provides the schema,maps the collection documents to the javascript objects
   * 
   * @description
   * 
   * @author: Ananya K
   * @version: 1.0.0
   * @since: 30-07-2021
   */
  const mongoose = require('mongoose');

  const UserRegisterSchema = mongoose.Schema({
      firstName: {
          type: String,
          required: true,
      },
      lastName: {
          type: String,
          required: true,
      },
      email: {
          type: String,
          required: true,
          unique: true
      },
      phoneNumber: {
          type: String,
          required: true,
          unique: true
      },
      password: {
          type: String,
          required: true
      }
  }, {
      timestamps: true
  });

  const UserRegister = mongoose.model('UserRegister', UserRegisterSchema);

  class UserRegisterModel {
      register = (userDetails, callback) => {
          const newUser = new UserRegister({
              firstName: userDetails.firstName,
              lastName: userDetails.lastName,
              email: userDetails.email,
              phoneNumber: userDetails.phoneNumber,
              password: userDetails.password
          });
          newUser.save((err, doc) => {
              if (err) {
                  callback(err, null);
              } else {
                  callback(null, doc);
              }
          });
      }

      login = (userCredentials, callback) => {
          UserRegister.findOne({'email':userCredentials.email}, (err, doc) => {
              if (err) {
                  callback(err, null);
              } else {
                  callback(null, doc);
              }
          });
      }
  }
  module.exports = new UserRegisterModel();