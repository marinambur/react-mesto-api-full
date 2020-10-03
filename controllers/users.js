const bcrypt = require('bcryptjs');
// eslint-disable-next-line
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const BadRequestError = require('../errors/BadRequestError');
const NotFoundError = require('../errors/NotFoundError');
const TokenError = require('../errors/TokenError');
const EmailError = require('../errors/EmailError');

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
    }))
    .catch((err) => {
      if (err.code === 11000) {
        throw new EmailError({ message: 'Пользователь с таким email уже зарегистрирован' });
      } else next(err);
    })// eslint-disable-next-line
    .then(({ _id, email }) => {
      res.status(201).send({ _id, email });
    })
    .catch(next);
};

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send(users))
    .catch(next);
};

module.exports.getUserById = (req, res, next) => {
  User.findById(req.params.id)
    .orFail()
    .catch(() => {
      throw new NotFoundError({ message: 'Нет пользователя с таким id' });
    })
    .then((user) => res.send(user))
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
