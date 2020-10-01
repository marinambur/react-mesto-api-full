const bcrypt = require('bcryptjs');
// eslint-disable-next-line
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const BadRequestError = require('../errors/BadRequestError');
const NotFoundError = require('../errors/NotFoundError');
const TokenError = require('../errors/TokenError');

module.exports.createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      email,
      password: hash,
      name,
      avatar,
      about,
    }))// eslint-disable-next-line
    .then(({ _id, email }) => {
      res.status(201).send({ _id, email });
    })
    .catch((err) => next(new BadRequestError(err)));
};

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send(users))
    .catch(next);
};

module.exports.getUserById = (req, res, next) => {
  User.findById(req.params.id)
    .then((user) => {
      if (user) {
        res.send(user);
      }
    })
    .catch((err) => {
      throw new NotFoundError({ message: `Пользователь с идентификатором ${err.message} не найден` });
    })
    .catch(next);
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  User.findUserByCredentials(email, password)
    .then((user) => {
      // создадим токен
      const token = jwt.sign({ _id: user._id }, 'some-secret-key', { expiresIn: '7d' });

      // вернём токен
      res.send({ token });
    })
    .catch(() => {
      throw new TokenError({ message: `Пользователь с идентификатором ${req.body.email} не найден` });
    })
    .catch(next);
};
