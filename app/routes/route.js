const userRegister = require("../controllers/userAuth.js");
const notes = require("../controllers/note.js");
const labels = require("../controllers/label.js");
const redis = require("../middleware/redis.js");
/**
 * @openapi
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
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
 *         email: warok12@gmail.com
 *         password: 123456
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
 *     ResetPassword:
 *       type: object
 *       required:
 *         - password
 *       properties:
 *         userId:
 *           type: string
 *           description: userId of user
 *         password:
 *           type: string
 *           descripton: password of user
 *         token:
 *           type: string
 *           descripton: token generated for a user
 *       example:
 *         password: Rita_Ruthe@12!
 *         token: 24aa73dbe462179bcfcd79ad2cb2b5e480e4f9b117109659c18d534ae365984d
 *         userId: 61129128fd7b4139c4d19f7d
 *     Note:
 *       type: object
 *       required:
 *         - title
 *         - description
 *       properties:
 *         title:
 *           type: string
 *           description: title of note
 *         userId:
 *           type: string
 *           description: user to which note belongs
 *         description:
 *           type: string
 *           description: description of note
 *         isPinned:
 *           type: boolean
 *           description: note is pinned or not
 *         isArchived:
 *           type: boolean
 *           description: note is archived or not
 *         isTrashed:
 *           type: boolean
 *           description: note is trashed or not
 *       example:
 *         title: hello note
 *         description: creating my first note
 *         isPinned: false
 *         userId: 61044f6e033c88027c68538d
 *     FindNotes:
 *       type: object
 *       required:
 *         - userId
 *       properties:
 *         userId:
 *           type: string
 *           description: user to which note belongs
 *       example:
 *         userId: 61044f6e033c88027c68538d
 *     TrashNote:
 *       type: object
 *       required:
 *         - isTrashed
 *       properties:
 *         isTrashed:
 *           type: boolean
 *           description: note is trashed or not
 *       example:
 *         isTrashed: false
 *     ArchiveNote:
 *       type: object
 *       required:
 *         - isArchived
 *       properties:
 *         isArchived:
 *           type: boolean
 *           description: note is archived or not
 *       example:
 *         isArchived: false
 *     PinNote:
 *       type: object
 *       required:
 *         - isPinned
 *       properties:
 *         isPinned:
 *           type: boolean
 *           description: note is pinned or not
 *       example:
 *         isPinned: false
 *     Label:
 *       type: object
 *       required:
 *         - labelName
 *         - noteId
 *       properties:
 *         labelName:
 *           type: string
 *           description: label name of note
 *         noteId:
 *           type: string
 *           description: note to which label belongs
 *         isActive:
 *           type: boolean
 *           description: label is active or not
 *       example:
 *         labelName: hello label
 *         noteId: 611bd48edd4342055c4fc72c
 *     RemoveLabel:
 *       type: object
 *       required:
 *         - isActive
 *       properties:
 *         isActive:
 *           type: boolean
 *           description: label is active or not
 *       example:
 *         isActive: false
 */

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
   *    name: Authentication
   *    description: Register a user
   */
  /**
   * @openapi
   * /register:
   *   post:
   *     tags: [Authentication]
   *     summary: Register a new user
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/Register'
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
   *
   * /login:
   *   post:
   *     summary: User login
   *     tags: [Authentication]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/Login'
   *     produces:
   *       - application/json
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
   *
   * /forgotPassword :
   *   post:
   *     tags: [Authentication]
   *     summary: Forgot password link is sent to email
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/ForgotPassword'
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

  /**
   * @openapi
   *
   * /resetPassword :
   *   post:
   *     tags: [Authentication]
   *     summary: Reset password confirmation sent to email
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/ResetPassword'
   *     responses:
   *          201:
   *              description: Reset password confirmation is sent to email successfully
   *              content:
   *                  application/json:
   *                      schema:
   *                          $ref: '#/components/schemas/ResetPassword'
   *          500:
   *              description: Some server error
   */
  app.post("/resetPassword", userRegister.resetPassword);

  /**
   * @openapi
   *  tags:
   *    name: Note
   *    description: Note APIs
   */
  /**
   * @openapi
   * /notes:
   *   post:
   *     security:
   *       - bearerAuth: []
   *     tags: [Note]
   *     summary: Create a note
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/Note'
   *     responses:
   *          201:
   *              description: The note is created successfully
   *              content:
   *                  application/json:
   *                      schema:
   *                          $ref: '#/components/schemas/Note'
   *          500:
   *              description: Some server error
   *          401:
   *              description: Access token is missing or invalid.
   */
  app.post("/notes", notes.create);

  /**
   * @openapi
   * /findNotes/{noteStatus}:
   *   post:
   *     security:
   *       - bearerAuth: []
   *     tags: [Note]
   *     summary: Retrieve all notes
   *     parameters:
   *      - in: path
   *        name: noteStatus
   *        required: true
   *        schema:
   *          type: string
   *        description: The note status
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/FindNotes'
   *     responses:
   *          200:
   *              description: The notes are retrieved successfully from cache
   *              content:
   *                  application/json:
   *                      schema:
   *                          $ref: '#/components/schemas/FindNotes'
   *          500:
   *              description: Some server error
   *          401:
   *              description: Access token is missing or invalid.
   */
  app.post("/findNotes/:noteStatus", redis.findNotes, notes.findNotes);

  /**
   * @openapi
   * /notes/{noteId}:
   *   get:
   *     security:
   *       - bearerAuth: []
   *     tags: [Note]
   *     summary: Retrieve a single note
   *     parameters:
   *      - in: path
   *        name: noteId
   *        required: true
   *        schema:
   *          type: string
   *        description: The user ID
   *     responses:
   *          200:
   *              description: The note is retrieved successfully
   *              content:
   *                  application/json:
   *                      schema:
   *                          $ref: '#/components/schemas/Note'
   *          500:
   *              description: Some server error
   *          401:
   *              description: Access token is missing or invalid.
   */
  app.get("/notes/:noteId", notes.findOne);

  /**
   * @openapi
   *
   * /notes/{noteId} :
   *   put:
   *     security:
   *       - bearerAuth: []
   *     tags: [Note]
   *     summary: Update a note
   *     parameters:
   *      - in: path
   *        name: noteId
   *        required: true
   *        schema:
   *          type: string
   *        description: The user ID
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/Note'
   *     responses:
   *          200:
   *              description: Updated a note successfully
   *              content:
   *                  application/json:
   *                      schema:
   *                          $ref: '#/components/schemas/Note'
   *          500:
   *              description: Some server error
   *          401:
   *              description: Access token is missing or invalid.
   */
  app.put("/notes/:noteId", notes.update);

  /**
   * @openapi
   *
   * /trashNote/{noteId}:
   *   put:
   *     security:
   *       - bearerAuth: []
   *     tags: [Note]
   *     summary: Trash/Restore a note
   *     parameters:
   *      - in: path
   *        name: noteId
   *        required: true
   *        schema:
   *          type: string
   *        description: The user ID
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/TrashNote'
   *     responses:
   *          200:
   *              description: Trashed a note successfully
   *              content:
   *                  application/json:
   *                      schema:
   *                          $ref: '#/components/schemas/TrashNote'
   *          500:
   *              description: Some server error
   *          401:
   *              description: Access token is missing or invalid.
   */
  app.put("/trashNote/:noteId", notes.trash);

  /**
   * @openapi
   *
   * /notes/{noteId}:
   *   delete:
   *     security:
   *       - bearerAuth: []
   *     tags: [Note]
   *     summary: Delete a note permanently
   *     parameters:
   *      - in: path
   *        name: noteId
   *        required: true
   *        schema:
   *          type: string
   *        description: The user ID
   *     responses:
   *          200:
   *              description: Deleted the note permanently
   *              content:
   *                  application/json:
   *                      schema:
   *                          $ref: '#/components/schemas/Note'
   *          500:
   *              description: Some server error
   *          401:
   *              description: Access token is missing or invalid.
   */
  app.delete("/notes/:noteId", notes.deleteForever);

  /**
   * @openapi
   *
   * /archiveNote/{noteId}:
   *   put:
   *     security:
   *       - bearerAuth: []
   *     tags: [Note]
   *     summary: Archive/Unarchive a note
   *     parameters:
   *      - in: path
   *        name: noteId
   *        required: true
   *        schema:
   *          type: string
   *        description: The user ID
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/ArchiveNote'
   *     responses:
   *          201:
   *              description: Archived a note
   *              content:
   *                  application/json:
   *                      schema:
   *                          $ref: '#/components/schemas/ArchiveNote'
   *          500:
   *              description: Some server error
   *          401:
   *              description: Access token is missing or invalid.
   */
  app.put("/archiveNote/:noteId", notes.archive);

  /**
   * @openapi
   *
   * /pinNote/{noteId}:
   *   put:
   *     security:
   *       - bearerAuth: []
   *     tags: [Note]
   *     summary: Pin/Unpin a note
   *     parameters:
   *      - in: path
   *        name: noteId
   *        required: true
   *        schema:
   *          type: string
   *        description: The user ID
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/PinNote'
   *     responses:
   *          201:
   *              description: Pin a note
   *              content:
   *                  application/json:
   *                      schema:
   *                          $ref: '#/components/schemas/PinNote'
   *          500:
   *              description: Some server error
   *          401:
   *              description: Access token is missing or invalid.
   */
  app.put("/pinNote/:noteId", notes.pin);

  /**
   * @openapi
   * /label:
   *   post:
   *     security:
   *       - bearerAuth: []
   *     tags: [Label]
   *     summary: Create a label
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/Label'
   *     responses:
   *          201:
   *              description: The label is created successfully
   *              content:
   *                  application/json:
   *                      schema:
   *                          $ref: '#/components/schemas/Label'
   *          500:
   *              description: Some server error
   *          401:
   *              description: Access token is missing or invalid.
   */
  app.post("/label", labels.create);
  /**
   * @openapi
   * /label/{noteId}:
   *   get:
   *     security:
   *       - bearerAuth: []
   *     tags: [Label]
   *     summary: Retrieve all labels
   *     parameters:
   *      - in: path
   *        name: noteId
   *        required: true
   *        schema:
   *          type: string
   *        description: The note ID
   *     responses:
   *          200:
   *              description: The labels are retrieved successfully from cache
   *              content:
   *                  application/json:
   *                      schema:
   *                          $ref: '#/components/schemas/Label'
   *          500:
   *              description: Some server error
   *          401:
   *              description: Access token is missing or invalid.
   */
  app.get("/label/:noteId", redis.findLabel, labels.findLabel);
  /**
   * @openapi
   * /label/{labelId}:
   *   put:
   *     security:
   *       - bearerAuth: []
   *     tags: [Label]
   *     summary: Update a label
   *     parameters:
   *      - in: path
   *        name: labelId
   *        required: true
   *        schema:
   *          type: string
   *        description: The label ID
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/RemoveLabel'
   *     responses:
   *          200:
   *              description: Update the label
   *              content:
   *                  application/json:
   *                      schema:
   *                          $ref: '#/components/schemas/RemoveLabel'
   *          500:
   *              description: Some server error
   *          401:
   *              description: Access token is missing or invalid.
   */
  app.put("/label/:labelId", labels.removeLabel);
};
