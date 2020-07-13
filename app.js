const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const users = require("./routes/users");
const cards = require("./routes/cards");

const { PORT = 3000 } = process.env;

const app = express();

mongoose.connect("mongodb://localhost:27017/mestodb", {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
});
app.use(bodyParser.json());
app.use((req, res, next) => {
  req.user = {
    _id: "5f021c69598f522aa82b3dab",
  };
  next();
});
app.use("/users", users);
app.use("/cards", cards);

app.use((req, res) => {
  res.status(404);
  res.send({ message: "Запрашиваемый ресурс не найден" });
});
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
