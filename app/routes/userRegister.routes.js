const userRegister = require('../controllers/userRegister.controller.js');

module.exports = (app) => {

    //maps the register request to userRegister method in userRegisterController
    app.post('/register', userRegister.register);

    app.post('/login', userRegister.login);

}