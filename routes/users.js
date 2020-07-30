const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');

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
        .regex(
          /^http(s)?:\/{2}(w{3}.)?(((([\w\d]+(-\w+)+)|(\w{2,}))(.[a-z]{2,6})+)|(([1-9]|([1-9]\d)|(1\d\d)|(2[1-4]\d)|(25[0-5]))(.([0-9]|([1-9]\d)|(1\d\d)|(2[0-4]\d)|(25[0-5]))){2}.([1-9]|([1-9]\d)|(1\d\d)|(2[1-4]\d)|(25[0-5]))))((:(([1-9]\d)|([1-9]\d\d)|([1-9]\d\d\d)|([1-9])))?)((\/[a-z]{2,})*(#)?)/,
        ),
    }),
  }),
  updateAvatar,
);

module.exports = router;
