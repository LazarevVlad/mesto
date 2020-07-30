const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const user = require('../models/user');
const NotFoundError = require('../errors/not-found-err');

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports.getUsers = (req, res, next) => {
  user
    .find({})
    .then((users) => res.send({ data: users }))
    .catch(next);
};

module.exports.getUserById = (req, res, next) => {
  user
    .findById(req.params.id)
    .then((client) => {
      if (client === null) {
        throw new NotFoundError('Нет пользователя с таким id');
      } else {
        res.send({ data: client });
      }
    })
    .catch(next);
};

module.exports.createUser = (req, res, next) => {
  const { name, about, avatar, email, password } = req.body;
  bcrypt
    .hash(password, 10)
    .then((hash) => user.create({ name, about, avatar, email, password: hash }))
    .then((client) =>
      res.send({
        id: client._id,
        name: client.name,
        about: client.about,
        avatar: client.avatar,
        email: client.email,
      }),
    )
    .catch((err) => {
      if (err.name === 'MongoError' && err.code === 11000) {
        res.status(409).send({ message: 'Такой email уже существует' });
      } else if (err.name === 'ValidationError') {
        res.status(400).send({ message: err.message });
      } else {
        next(err);
      }
    });
};
module.exports.updateUserInfo = (req, res, next) => {
  const { name, about } = req.body;
  user
    .findByIdAndUpdate(
      req.user._id,
      { name, about },
      {
        new: true,
        runValidators: true,
      },
    )
    .then((userInfo) => {
      res.send({ data: userInfo });
    })
    .catch(() => {
      const err = new Error('Ошибка при обновлении данных');
      err.statusCode = 400;
      next(err);
    });
};

module.exports.updateAvatar = (req, res, next) => {
  const { avatar } = req.body;
  console.log(req.user._id);
  user
    .findByIdAndUpdate(
      req.user._id,
      { avatar },
      {
        new: true,
        runValidators: true,
      },
    )
    .then((userAvatar) => {
      res.send({ data: userAvatar });
    })
    .catch(next);
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  return user
    .findUserByCredentials(email, password)
    .then((client) => {
      const token = jwt.sign(
        { _id: client._id },
        NODE_ENV === 'production' ? JWT_SECRET : 'secret',
        {
          expiresIn: '7d',
        },
      );
      res.cookie('jwt', token, {
        maxAge: 3600000 * 24 * 7,
        httpOnly: true,
        // eslint-disable-next-line no-undef
        sameSite: strict,
      });
      res.status(200).send({ message: 'Аутентификация прошла успешно' });
    })
    .catch(() => {
      const err = new Error('Неправильная почта или пароль');
      err.statusCode = 401;
      next(err);
    });
};
