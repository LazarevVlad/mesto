const User = require("../models/user");

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch(() => res.status(500).send({ message: "Ошибка" }));
};

module.exports.getUserById = (req, res) => {
  User.findById(req.params.id).then((user) =>
    res
      .send({ data: user })
      .catch(() => res.status(500).send({ message: "Ошибка" }))
  );
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => res.send({ data: user }))
    .catch(() => res.status(500).send({ message: "Ошибка" }));
};
