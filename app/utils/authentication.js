const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
class AuthenticationHelper {
    encryptPassword = (password) => {
        try {
            return bcrypt.hashSync(password, Number(process.env.SALT_ROUNDS));
        } catch (error) {
            throw "Error while encrypting the password";
        }
    }

    comparePassword = (userEnteredPassword, passwordInDb) => {
        try {
            return bcrypt.compareSync(userEnteredPassword, passwordInDb);
        } catch (error) {
            throw "Error while comparing the password";
        }
    }

    generateToken = (doc) => {
        try {
            return jwt.sign({
                data: doc.email,
                expiresIn: process.env.PASSWORD_EXPIRY
            }, process.env.APP_SECRET);
        } catch (error) {
            throw "Error while generating the token";
        }
    }
}

module.exports = new AuthenticationHelper();