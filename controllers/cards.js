const Card = require('../models/card');
const BadRequestError = require('../errors/BadRequestError');
const NotFoundError = require('../errors/NotFoundError');
const createCard = (req, res, next) => {
  const {name, link} = req.body;
  Card.create({name, link, owner: req.user._id})

    .catch((err) => {
      throw new BadRequestError({message: `Запрос некорректен: ${err.message}`});
    })
    .then((card) => res.send(card))
    .catch(next);
};

const getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.send(cards))
    .catch(next);
};

const deleteCardById = (req, res, next) => {
  const owner = req.user._id;
  Card.findByIdAndRemove({_id: req.params.id, owner})
    .then((card) => {
      if (card) {
        res.send(card);
        return;
      }
      throw new NotFoundError({message: 'Нет карточки с таким id'});
    })
    .catch((err) => {
      if (err.name === 'DocumentNotFoundError') {
        throw new NotFoundError({message: 'Нет карточки с таким id'});
      }
      throw new BadRequestError({message: 'Необходима авторизация'});
    })
    .catch(next);
};

module.exports = {
  createCard,
  getCards,
  deleteCardById,
};
