const Joi = require("joi");
const validationUserRegistration = Joi.object({
  firstName: Joi.string().min(2).max(30).required(),
  lastName: Joi.string().min(2).max(30).required().pattern(new RegExp("^[a-zA-Z']{2,30}$")),
  email: Joi.string()
    .email({
      minDomainSegments: 2,
      tlds: {
        allow: ["com", "net"],
      },
    })
    .required()
    .pattern(new RegExp("^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:.[a-zA-Z0-9-]+)*$")),
  password: Joi.string().required().pattern(new RegExp("^(?=.*[0-9])[a-zA-Z0-9!@_#$%^&*]{6,16}$")),
});

const validateUserLogin = Joi.object({
  email: Joi.string()
    .email()
    .required()
    .pattern(new RegExp("^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:.[a-zA-Z0-9-]+)*$")),
  password: Joi.string().required(),
});

const validateForgotPassword = Joi.object({
  email: Joi.string()
    .email()
    .required()
    .pattern(new RegExp("^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:.[a-zA-Z0-9-]+)*$")),
});

const validateResetPassword = Joi.object({
  password: Joi.string().required().pattern(new RegExp("^(?=.*[0-9])[a-zA-Z0-9!@_#$%^&*]{6,16}$")),
});

const validateCreateNote = Joi.object({
  title: Joi.string().max(50).required(),
  description: Joi.string().max(100).required(),
  isPinned: Joi.boolean(),
  labels: Joi.array(),
  userId: Joi.string().required(),
});

const validateCreateLabel = Joi.object({
  labelName: Joi.string().max(100).required(),
});

const validateDeleteNote = Joi.object({
  isTrashed: Joi.boolean().required(),
  userId: Joi.string().required(),
});

const validateArchiveNote = Joi.object({
  isArchived: Joi.boolean().required(),
  userId: Joi.string().required(),
});
const validatePinNote = Joi.object({
  isPinned: Joi.boolean().required(),
  userId: Joi.string().required(),
});
module.exports = {
  validationUserRegistration,
  validateUserLogin,
  validateForgotPassword,
  validateResetPassword,
  validateCreateNote,
  validateDeleteNote,
  validateArchiveNote,
  validatePinNote,
  validateCreateLabel,
};
