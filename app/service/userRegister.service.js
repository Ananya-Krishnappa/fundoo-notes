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
}
module.exports = new UserRegisterService();