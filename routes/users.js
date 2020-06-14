const router = require("express").Router();
const path = require("path");
const userPath = path.join(__dirname, "../data/users.json");

const users = require(userPath);

router.get("/", (req, res) => {
  res.send(users);
  next();
});

router.get("/:_id", (req, res, next) => {
  if (!users[req.params._id]) {
    res.send(`Такого пользователя не существует`);
    return;
  }
  res.send(users[req.params._id]);
  next();
});
module.exports = router;
