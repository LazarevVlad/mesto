const card = require("../models/card");

module.exports.getCards = (req, res) => {
  card
    .find({})
    .then((cards) => res.send({ data: cards }))
    .catch(() => res.status(500).send({ message: "Карточки не найдены" }));
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  card
    .create({ name, link, owner: req.user._id })
    .then((response) => res.send({ data: response }))
    .catch(() =>
      res.status(500).send({ message: "Ошибка при создании карточки" })
    );
};

module.exports.deleteCard = (req, res) => {
  card
    .findById(req.params.id)
    .orFail(new Error("Пользователь не найден"))
    .then((response) => {
      if (req.user._id === response.owner.toString()) {
        card
          .findByIdAndDelete(req.params.id)
          .then(() =>
            res.status(200).send({ message: "Карточка удалена успешно!" })
          );
      } else {
        res
          .status(403)
          .send({ message: "Вы не можете удалить чужую карточку" });
      }
    })
    .catch(() => res.status(500).send({ message: "Ошибка при удалении" }));
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
