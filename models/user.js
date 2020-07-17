const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const validation = require('validator');

const userSchema = new mongoose.Schema({
  email: {
    type: mongoose.Schema.Types.String,
    unique: true,
    required: true,
    validate: {
      validator: (v) => validation.isEmail(v),
      message: 'Неправильный формат почты',
    },
  },
  password: {
    type: mongoose.Schema.Types.String,
    required: true,
    select: false,
    minlength: 8,
  },
  name: {
    type: mongoose.Schema.Types.String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  about: {
    type: mongoose.Schema.Types.String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  avatar: {
    type: mongoose.Schema.Types.String,
    validate: {
      validator: (v) => validation.isURL(v),
      message: 'Введите ссылку',
    },
    required: true,
  },
});
userSchema.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email })
    .select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(new Error('Неправильные почта или пароль'));
      }
      return bcrypt.compare(password, user.password).then((matched) => {
        if (!matched) {
          return Promise.reject(new Error('Неправильные почта или пароль'));
        }
        return user;
      });
    });
};
module.exports = mongoose.model('user', userSchema);
