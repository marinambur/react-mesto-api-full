const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const NotFoundError = require('./errors/NotFoundError.js');
const app = express();
const { requestLogger, errorLogger } = require('./middlewares/logger');
const userRouter = require('./routes/users');
const cardRouter = require('./routes/cards');
const {createUser} = require("./controllers/users");
const {login} = require("./controllers/users");
const auth = require('./middlewares/auth');
const { validateUser, validateLogin } = require('./middlewares/requestValidation');
const { errors } = require('celebrate');
const {
  PORT = 3000,
} = process.env;

app.use(requestLogger);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.post('/signup', validateUser, createUser);
app.post('/signin', validateLogin, login);

app.use('/users', auth, userRouter);
app.use('/cards', auth, cardRouter);
app.use(errorLogger); // подключаем логгер ошибок

app.use(errors()); // обработчик ошибок celebrate
app.use((err, req, res, next) => {
  if (err.status) {
    res.status(err.status).send(err.message);
    return;
  }
  res.status(500).send({ message: `На сервере произошла ошибка: ${err.message}` });
  next();
});

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

app.use(() => {
  throw new NotFoundError({ message: 'Запрашиваемый ресурс не найден' });
});
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
