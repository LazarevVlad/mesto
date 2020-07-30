const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const urlValidation = require('../regExp/urlValidation');

const {
  getUsers,
  getUserById,
  updateUserInfo,
  updateAvatar,
} = require('../controllers/users');

router.get('/', getUsers);
router.get(
  '/:id',
  celebrate({
    params: Joi.object().keys({
      id: Joi.string().hex().length(24),
    }),
  }),
  getUserById,
);
router.patch(
  '/me',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().required().min(2).max(30),
      about: Joi.string().min(2).max(30),
    }),
  }),
  updateUserInfo,
);
router.patch(
  '/me/avatar',
  celebrate({
    body: Joi.object().keys({
      avatar: Joi.string()
        .required()
        .regex(urlValidation)
        .error(new Error('Неправильный формат записи ссылки')),
    }),
  }),
  updateAvatar,
);

module.exports = router;
