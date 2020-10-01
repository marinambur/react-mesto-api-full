const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
let User = require('../models/user');
const BadRequestError = require('../errors/BadRequestError');
const NotFoundError = require('../errors/NotFoundError');
const TokenError = require('../errors/TokenError');

module.exports.createUser = (req, res, next) => {  // хешируем пароль
  bcrypt.hash(req.body.password, 10)
    .then(hash => User.create({
      email: req.body.email,
      name: req.body.name,
      about: req.body.about,
      avatar: req.body.avatar,
      password: hash,
    }))

    .then((user) => res.send(user))
    .catch((err) => {
      throw new BadRequestError({message: `Запрос некорректен: ${err.message}`});
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
    .then((user) => {
      if (user) {
        res.send(user);

      }

    })
    .catch((err) => {
      throw new NotFoundError({message: `Пользователь с идентификатором ${err.message} не найден`});
    })
    .catch(next);
};


module.exports.login = (req, res, next) => {
  const {email, password} = req.body;

  User.findUserByCredentials(email, password)
    .then((user) => {
      // создадим токен
      const token = jwt.sign({_id: user._id}, 'some-secret-key', {expiresIn: '7d'});

      // вернём токен
      res.send({token});
    })
    .catch(() => {
      throw new TokenError({message: `Пользователь с идентификатором ${req.body.email} не найден`});
    })
    .catch(next);
};


