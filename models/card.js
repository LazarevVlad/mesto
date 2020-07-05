const mongoose = require("mongoose");

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
        return /http(s)?:\/{2}(w{3}.)?(((([\w\d]+(-\w+)+)|(\w{2,}))(.[a-z]{2,6})+)|(([1-9]|([1-9]\d)|(1\d\d)|(2[1-4]\d)|(25[0-5]))(.([0-9]|([1-9]\d)|(1\d\d)|(2[0-4]\d)|(25[0-5]))){2}.([1-9]|([1-9]\d)|(1\d\d)|(2[1-4]\d)|(25[0-5]))))((:(([1-9]\d)|([1-9]\d\d)|([1-9]\d\d\d)|([1-9])))?)((\/[a-z]{2,})*(#)?)/.test(
          v
        );
      },
      message: "Введите ссылку",
    },
    required: true,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "user",
  },
  likes: {
    type: [mongoose.Schema.Types.ObjectId],
    default: [],
    ref: "user",
  },
  createdAt: {
    type: mongoose.Schema.Types.Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("card", cardSchema);
