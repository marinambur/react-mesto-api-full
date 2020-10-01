const { celebrate, Joi, CelebrateError } = require('celebrate');
const validator = require('validator');
// eslint-disable-next-line
const urlValidation = (value) => {
  if (!validator.isURL(value)) {
    throw new CelebrateError('Некорректный URL');
  }
  return value;
};

const validateCard = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().min(2).max(500),
  }),
});

const validateId = celebrate({
  params: Joi.object().keys({
    id: Joi.string().alphanum().length(24).hex(),
  }),
});

const validateUser = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(20),
    avatar: Joi.string().required().min(2).max(500),
    email: Joi.string().required().email(),
    password: Joi.string().required().min(6),
  }),
});

const validateLogin = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(6),
  }),
});

module.exports = {
  validateCard,
  validateId,
  validateUser,
  validateLogin,
};
