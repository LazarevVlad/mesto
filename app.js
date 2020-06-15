const express = require("express");
const path = require("path");
const users = require("./routes/users");
const cards = require("./routes/cards");

const { PORT = 3000 } = process.env;

const app = express();

app.use("/users", users);
app.use("/cards", cards);
app.use(express.static(path.join(__dirname, "/public")));
app.use((err, req, res, next) => {
  res.status(404);
  res.json({ message: "Запрашиваемый ресурс не найден" });
});
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
