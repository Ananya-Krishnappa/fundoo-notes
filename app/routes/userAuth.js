const userRegister = require('../controllers/userAuth.js');

module.exports = (app) => {

    //maps the register request to userRegister method in userRegisterController
    app.post('/register', userRegister.register);

    //maps the register request to login method in userRegisterController
    app.post('/login', userRegister.login);

}