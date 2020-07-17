const mongoose = require('mongoose');
const validation = require('validator');

const cardSchema = new mongoose.Schema({
  name: {
    type: mongoose.Schema.Types.String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  link: {
    type: mongoose.Schema.Types.String,
    validate: {
      validator(v) {
        return validation.isURL(v);
      },
      message: 'Введите ссылку',
    },
    required: true,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'user',
  },
  likes: {
    type: [mongoose.Schema.Types.ObjectId],
    default: [],
    ref: 'user',
  },
  createdAt: {
    type: mongoose.Schema.Types.Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('card', cardSchema);
