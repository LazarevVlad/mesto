const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const urlValidation = require('../regExp/urlValidation');

const {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
} = require('../controllers/cards');

router.get('/', getCards);
router.post(
  '/',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().required().min(2).max(30),
      link: Joi.string()
        .required()
        .regex(urlValidation)
        .error(new Error('Неправильный формат записи ссылки')),
    }),
  }),
  createCard,
);
router.delete(
  '/:id',
  celebrate({
    params: Joi.object().keys({
      id: Joi.string().hex().length(24),
    }),
  }),
  deleteCard,
);
router.put(
  '/:id/likes',
  celebrate({
    params: Joi.object().keys({
      id: Joi.string().hex().length(24),
    }),
  }),
  likeCard,
);
router.delete(
  '/:id/likes',
  celebrate({
    params: Joi.object().keys({
      id: Joi.string().hex().length(24),
    }),
  }),
  dislikeCard,
);

module.exports = router;
