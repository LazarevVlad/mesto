const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const { celebrate, Joi, errors } = require('celebrate');
const users = require('./routes/users');
const cards = require('./routes/cards');
const { createUser, login } = require('./controllers/users');
const auth = require('./middleware/auth');
const { requestLogger, errorLogger } = require('./middleware/logger');
const NotFoundError = require('./errors/not-found-err');

const { PORT = 3000 } = process.env;

const app = express();

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  autoIndex: true,
});
app.use(bodyParser.json());
app.use(cookieParser());
app.use(requestLogger);
app.post(
  '/signin',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required().min(8),
    }),
  }),
  login,
);
app.post(
  '/signup',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().required().min(2).max(30),
      about: Joi.string().min(2).max(30),
      avatar: Joi.string()
        .required()
        .regex(
          /^http(s)?:\/{2}(w{3}.)?(((([\w\d]+(-\w+)+)|(\w{2,}))(.[a-z]{2,6})+)|(([1-9]|([1-9]\d)|(1\d\d)|(2[1-4]\d)|(25[0-5]))(.([0-9]|([1-9]\d)|(1\d\d)|(2[0-4]\d)|(25[0-5]))){2}.([1-9]|([1-9]\d)|(1\d\d)|(2[1-4]\d)|(25[0-5]))))((:(([1-9]\d)|([1-9]\d\d)|([1-9]\d\d\d)|([1-9])))?)((\/[a-z]{2,})*(#)?)/,
        ),
      email: Joi.string().required().email(),
      password: Joi.string().required().min(8),
    }),
  }),
  createUser,
);
app.use(auth);
app.use('/users', users);
app.use('/cards', cards);
app.use(errorLogger);

app.use(() => {
  throw new NotFoundError('Запрашиваемый ресурс не найден');
});
app.use(errors());
app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;

  res.status(statusCode).send({
    message: statusCode === 500 ? 'На сервере произошла ошибка' : message,
  });
});
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
