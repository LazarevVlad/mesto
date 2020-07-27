const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const user = require('../models/user');
const NotFoundError = require('../errors/not-found-err');

module.exports.getUsers = (req, res) => {
  user
    .find({})
    .then((users) => res.send({ data: users }))
    .catch(() => res.status(400).send({ message: 'Пользователи не найдены' }));
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
    .catch(next);
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
    .catch(next);
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
      const token = jwt.sign({ _id: client._id }, 'secret', {
        expiresIn: '7d',
      });
      res.cookie('jwt', token, {
        maxAge: 3600000 * 24 * 7,
        httpOnly: true,
      });
      res.status(200).send({ message: 'Аутентификация прошла успешно' });
    })
    .catch(next);
};
