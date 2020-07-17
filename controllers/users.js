const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const user = require('../models/user');

module.exports.getUsers = (req, res) => {
  user
    .find({})
    .then((users) => res.send({ data: users }))
    .catch(() => res.status(400).send({ message: 'Пользователи не найдены' }));
};

module.exports.getUserById = (req, res) => {
  user
    .findById(req.params.id)
    .then((client) => {
      if (client === null) {
        res.status(404).send({ message: 'Пользователь не найден' });
      } else {
        res.send({ data: client });
      }
    })
    .catch(() => res.status(400).send({ message: 'Пользователь не найден' }));
};

module.exports.createUser = (req, res) => {
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
      if (password === undefined) {
        res.status(400).send({ message: 'Введите пароль' });
      } else if (err.name === 'MongoError' && err.code === 11000) {
        res.status(409).send({ message: 'Такой email уже существует' });
      } else if (err.name === 'ValidationError') {
        res.status(400).send({ message: err });
      } else {
        res.status(400).send({ message: err });
      }
    });
};
module.exports.updateUserInfo = (req, res) => {
  const { name, about } = req.body;
  user
    .findByIdAndUpdate(
      req.params.id,
      { name, about },
      {
        new: true,
        runValidators: true,
      },
    )
    .then((userInfo) => {
      res.send({ data: userInfo });
    })
    .catch(() =>
      res.status(400).send({ message: 'Ошибка при обновлении данных' }),
    );
};

module.exports.updateAvatar = (req, res) => {
  const { avatar } = req.body;
  user
    .findByIdAndUpdate(
      req.params.id,
      { avatar },
      {
        new: true,
        runValidators: true,
      },
    )
    .then((userAvatar) => {
      res.send({ data: userAvatar });
    })
    .catch(() =>
      res.status(400).send({ message: 'Ошибка при обновлении данных' }),
    );
};

module.exports.login = (req, res) => {
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
    .catch(() => {
      res.status(401).send({ message: 'Неправильная почта или пароль' });
    });
};
