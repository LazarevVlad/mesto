const card = require('../models/card');
const NotFoundError = require('../errors/not-found-err');
const ForbiddenError = require('../errors/forbidden-err');

module.exports.getCards = (req, res, next) => {
  card
    .find({})
    .then((cards) => res.send({ data: cards }))
    .catch(next);
};

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  card
    .create({ name, link, owner: req.user._id })
    .then((response) => res.send({ data: response }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: err.message });
      } else {
        next(err);
      }
    });
};

module.exports.deleteCard = (req, res, next) => {
  card
    .findById(req.params.id)
    .orFail(new Error(`Карточка с id:${req.params.id} не найдена`))
    .then((response) => {
      if (req.user._id === response.owner.toString()) {
        card
          .findByIdAndDelete(req.params.id)
          .then(() =>
            res.status(200).send({ message: 'Карточка удалена успешно!' }),
          );
      } else {
        throw new ForbiddenError('Вы не можете удалить чужую карточку');
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send({ message: 'Неправильный id' });
      } else {
        next(err);
      }
    });
};

module.exports.likeCard = (req, res, next) => {
  card
    .findByIdAndUpdate(
      req.params.id,
      { $addToSet: { likes: req.user._id } },
      { new: true },
    )
    .then((response) => {
      if (response === null) {
        throw new NotFoundError('Карточка не найдена');
      } else {
        res.send({ data: response });
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send({ message: 'Неправильный id' });
      } else {
        next(err);
      }
    });
};

module.exports.dislikeCard = (req, res, next) => {
  card
    .findByIdAndUpdate(
      req.params.id,
      { $pull: { likes: req.user._id } },
      { new: true },
    )
    .then((response) => {
      if (response === null) {
        throw new NotFoundError('Карточка не найдена');
      } else {
        res.send({ data: response });
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send({ message: 'Неправильный id' });
      } else {
        next(err);
      }
    });
};
