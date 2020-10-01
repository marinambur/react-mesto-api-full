const express = require('express');
const {
  createCard, getCards, deleteCardById,
} = require('../controllers/cards');
const { validateCard, validateId } = require('../middlewares/requestValidation');

const cardRouter = express.Router();
cardRouter.get('/', getCards);
cardRouter.delete('/:id', validateId, deleteCardById);
cardRouter.post('/', validateCard, createCard);
module.exports = cardRouter;
