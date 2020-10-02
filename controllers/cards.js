const Card = require('../models/card');
const BadRequestError = require('../errors/BadRequestError');
const NotFoundError = require('../errors/NotFoundError');
const ForbiddenError = require('../errors/ForbiddenError');

const createCard = (req, res, next) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })

    .catch((err) => {
      throw new BadRequestError({ message: `Запрос некорректен: ${err.message}` });
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
  Card.findOne({ _id: req.params.id })
    .orFail(() => new NotFoundError('Нет карточки с таким id'))
    .then((card) => {
      if (String(card.owner) !== owner) throw new ForbiddenError('Недостаточно прав для удаления этой карточки');
      return Card.findByIdAndDelete(card._id);
    })
    .then((success) => res.send(success))
    .catch(next);
};

module.exports = {
  createCard,
  getCards,
  deleteCardById,
};
