const user = require("../models/user");

module.exports.getUsers = (req, res) => {
  user
    .find({})
    .then((users) => res.send({ data: users }))
    .catch(() => res.status(500).send({ message: "Ошибка" }));
};

module.exports.getUserById = (req, res) => {
  user
    .findById(req.params.id)
    .then((client) => {
      if (client === null) {
        res.status(404).send({ message: "Пользователь не найден" });
      } else {
        res.send({ data: client });
      }
    })
    .catch(() => res.status(500).send({ message: "Ошибка" }));
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  user
    .create({ name, about, avatar })
    .then((client) => res.send({ data: client }))
    .catch(() => res.status(500).send({ message: "Ошибка" }));
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
      }
    )
    .then((userInfo) => {
      if (userInfo === null) {
        res.status(404).send({ message: "Пользователь не найден" });
      } else {
        res.send({ data: userInfo });
      }
    })
    .catch(() => res.send({ message: "Ошибка" }));
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
      }
    )
    .then((userAvatar) => {
      if (userAvatar === null) {
        res.status(404).send({ message: "Пользователь не найден" });
      } else {
        res.send({ data: userAvatar });
      }
    })
    .catch(() => res.send({ message: "Ошибка" }));
};
