/**
 * @openapi
 * components:
 *   schemas:
 *     Register:
 *       type: object
 *       required:
 *         - firstName
 *         - lastName
 *         - email
 *         - phoneNumber
 *         - password
 *       properties:
 *         id:
 *           type: integer
 *           description: The Auto-generated id of a post
 *         firstName:
 *           type: string
 *           description: first name of user
 *         lastName:
 *           type: string
 *           description: last name of user
 *         email:
 *           type: string
 *           descripton: email of user
 *         phoneNumber:
 *           type: string
 *           descripton: phoneNumber of user
 *         password:
 *           type: string
 *           descripton: password of user
 *         createdAt:
 *            type: string
 *            format: date
 *            description: The date of the record creation
 *         updatedAt:
 *            type: string
 *            format: date
 *            description: The date of the record creation
 *       example:
 *         firstName: Willa
 *         lastName: Bartell
 *         email: Rita_Rutherford6@gmail.com
 *         phoneNumber: (705) 995-6141
 *         password: BPG1_UAn8gt9LQx
 *     Login:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         token:
 *           type: string
 *           description: jwt token on successful authentication
 *         email:
 *           type: string
 *           descripton: email of user
 *         password:
 *           type: string
 *           descripton: password of user
 *       example:
 *         email: Rita_Rutherford6@gmail.com
 *         password: BPG1_UAn8gt9LQx
 *     ForgotPassword:
 *       type: object
 *       required:
 *         - email
 *       properties:
 *         link:
 *           type: string
 *           description: send password reset link to email
 *         email:
 *           type: string
 *           descripton: email of user
 *       example:
 *         email: Rita_Rutherford6@gmail.com
 */

const userRegister = require("../controllers/userAuth.js");

module.exports = (app) => {
  /**
   * @openapi
   *  tags:
   *    name: Welcome
   *    description: Welcome Page
   */
  /**
   * @openapi
   * /:
   *   get:
   *     tags: [Welcome]
   *     description: Welcome to Fundoo-Notes application!
   *     responses:
   *       200:
   *         description: Take notes quickly. Organize and keep track of all your notes.
   */
  app.get("/", (req, res) => {
    res.json({
      message: "Welcome to Fundoo-Notes application. Take notes quickly. Organize and keep track of all your notes.",
    });
  });

  /**
   * @openapi
   *  tags:
   *    name: Register
   *    description: Register a user
   */
  /**
   * @openapi
   * /register:
   *   post:
   *     tags: [Register]
   *     summary: Register a new user
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/Register'
   *     parameters:
   *       - name: firstName
   *         in: formData
   *         required: true
   *         type: string
   *       - name: lastName
   *         in: formData
   *         required: true
   *         type: string
   *       - name: email
   *         in: formData
   *         required: true
   *         type: string
   *       - name: phoneNumber
   *         in: formData
   *         required: true
   *         type: string
   *       - name: password
   *         in: formData
   *         required: true
   *         type: string
   *     responses:
   *          201:
   *              description: The user is registered successfully
   *              content:
   *                  application/json:
   *                      schema:
   *                          $ref: '#/components/schemas/Register'
   *          500:
   *              description: Some server error
   */
  app.post("/register", userRegister.register);

  /**
   * @openapi
   *    tags:
   *      name: Login
   *      description: User login
   */
  /**
   * @openapi
   *
   * /login:
   *   post:
   *     summary: User login
   *     tags: [Login]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/Login'
   *     produces:
   *       - application/json
   *     parameters:
   *       - name: email
   *         in: formData
   *         required: true
   *         type: string
   *       - name: password
   *         in: formData
   *         required: true
   *         type: string
   *     responses:
   *          200:
   *              description: Login successful
   *              content:
   *                  application/json:
   *                      schema:
   *                          $ref: '#/components/schemas/Login'
   *          500:
   *              description: Some server error
   */
  app.post("/login", userRegister.login);

  /**
   * @openapi
   *    tags:
   *      name: ForgotPassword
   *      description: Forgot Password
   */

  /**
   * @openapi
   *
   * /forgotPassword :
   *   post:
   *     tags: [ForgotPassword]
   *     summary: Forgot password link is sent to email
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/ForgotPassword'
   *     parameters:
   *       - name: email
   *         in: formData
   *         required: true
   *         type: string
   *     responses:
   *          201:
   *              description: The password link is sent successfully
   *              content:
   *                  application/json:
   *                      schema:
   *                          $ref: '#/components/schemas/ForgotPassword'
   *          500:
   *              description: Some server error
   */
  app.post("/forgotPassword", userRegister.forgotPassword);
};
