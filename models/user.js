const mongoose = require("mongoose");
const validation = require("validator");

const userSchema = new mongoose.Schema({
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
      validator(v) {
        return validation.isURL(v);
      },
      message: "Введите ссылку",
    },
    required: true,
  },
});

module.exports = mongoose.model("user", userSchema);
