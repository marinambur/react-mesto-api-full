const express = require('express');
const { getUsers, getUserById } = require('../controllers/users');
const { validateId } = require('../middlewares/requestValidation');
const userRouter = express.Router();
userRouter.get('/', getUsers);
userRouter.get('/:id', validateId, getUserById);
module.exports = userRouter;
