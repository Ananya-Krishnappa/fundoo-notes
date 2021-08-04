const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
class AuthenticationHelper {
  /**
   * @description Function to encrypt the password
   * @param {*} password
   * @returns string
   */
  encryptPassword = (password) => {
    try {
      return bcrypt.hashSync(password, Number(process.env.SALT_ROUNDS));
    } catch (error) {
      throw "Error while encrypting the password";
    }
  };

  /**
   * @description Function to compare passwords
   * @param {*} userEnteredPassword, passwordInDb
   * @returns boolean
   */
  comparePassword = (userEnteredPassword, passwordInDb) => {
    try {
      return bcrypt.compareSync(userEnteredPassword, passwordInDb);
    } catch (error) {
      throw "Error while comparing the password";
    }
  };

  /**
   * @description Function to generate token if the credentials passes
   * @param {*} doc
   * @returns jwt token
   */
  generateToken = (doc) => {
    try {
      return jwt.sign(
        {
          data: doc.email,
          expiresIn: process.env.PASSWORD_EXPIRY,
        },
        process.env.APP_SECRET
      );
    } catch (error) {
      throw "Error while generating the token";
    }
  };
}

module.exports = new AuthenticationHelper();
