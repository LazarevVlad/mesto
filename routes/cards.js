const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');

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
        .regex(
          /^http(s)?:\/{2}(w{3}.)?(((([\w\d]+(-\w+)+)|(\w{2,}))(.[a-z]{2,6})+)|(([1-9]|([1-9]\d)|(1\d\d)|(2[1-4]\d)|(25[0-5]))(.([0-9]|([1-9]\d)|(1\d\d)|(2[0-4]\d)|(25[0-5]))){2}.([1-9]|([1-9]\d)|(1\d\d)|(2[1-4]\d)|(25[0-5]))))((:(([1-9]\d)|([1-9]\d\d)|([1-9]\d\d\d)|([1-9])))?)((\/[a-z]{2,})*(#)?)/,
        ),
    }),
  }),
  createCard,
);
router.delete(
  '/:id',
  celebrate({
    params: Joi.object().keys({
      id: Joi.string().alphanum().length(24),
    }),
  }),
  deleteCard,
);
router.put(
  '/:id/likes',
  celebrate({
    params: Joi.object().keys({
      id: Joi.string().alphanum().length(24),
    }),
  }),
  likeCard,
);
router.delete(
  '/:id/likes',
  celebrate({
    params: Joi.object().keys({
      id: Joi.string().alphanum().length(24),
    }),
  }),
  dislikeCard,
);

module.exports = router;
