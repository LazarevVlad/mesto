const card = require("../models/card");

module.exports.getCards = (req, res) => {
  card
    .find({})
    .then((cards) => res.send({ data: cards }))
    .catch(() => res.status(500).send({ message: "Ошибка" }));
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  card
    .create({ name, link, owner: req.user._id })
    .then((response) => res.send({ data: response }))
    .catch(() => res.status(500).send({ message: "Ошибка 2" }));
};

module.exports.deleteCard = (req, res) => {
  card
    .findByIdAndDelete(req.params.id)
    .orFail(new Error("Пользователь не найден"))
    .then((response) => res.send({ data: response }))
    .catch(() => res.status(500).send({ message: "Ошибка" }));
};

module.exports.likeCard = (req, res) => {
  card
    .findByIdAndUpdate(
      req.params.id,
      { $addToSet: { likes: req.user._id } },
      { new: true }
    )
    .then((response) => {
      if (response === null) {
        res.status(404).send({ message: "Карточка не найдена" });
      } else {
        res.send({ data: response });
      }
    })
    .catch(() => res.status(500).send({ message: "Ошибка" }));
};

module.exports.dislikeCard = (req, res) => {
  card
    .findByIdAndUpdate(
      req.params.id,
      { $pull: { likes: req.user._id } },
      { new: true }
    )
    .then((response) => {
      if (response === null) {
        res.status(404).send({ message: "Карточка не найдена" });
      } else {
        res.send({ data: response });
      }
    })
    .catch(() => res.status(500).send({ message: "Ошибка" }));
};
